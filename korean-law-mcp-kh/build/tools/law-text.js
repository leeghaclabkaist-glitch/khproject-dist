/**
 * get_law_text Tool - 법령 조문 조회
 */
import { z } from "zod";
import { buildJO } from "../lib/law-parser.js";
import { lawCache } from "../lib/cache.js";
import { formatArticleUnit, flattenContent } from "../lib/article-parser.js";
import { formatToolError } from "../lib/errors.js";
import { MAX_RESPONSE_SIZE, truncateResponse } from "../lib/schemas.js";
export const GetLawTextSchema = z.object({
    mst: z.string().optional().describe("법령일련번호 (search_law에서 획득)"),
    lawId: z.string().optional().describe("법령ID (search_law에서 획득)"),
    jo: z.string().optional().describe("조문 번호 (예: '제38조'). 특정 편/장/절(예: '제2장') 전체가 필요한 경우 이 값을 비우고 전체 목차를 먼저 조회한 뒤, 목차를 보고 get_batch_articles로 해당 조문들을 일괄 조회하세요."),
    efYd: z.string().optional().describe("시행일자 (YYYYMMDD 형식)"),
    apiKey: z.string().optional().describe("법제처 Open API 인증키(OC). 사용자가 제공한 경우 전달")
}).refine(data => data.mst || data.lawId, {
    message: "mst 또는 lawId 중 하나는 필수입니다"
});
export async function getLawText(apiClient, input) {
    try {
        // 조문 번호가 한글이면 JO 코드로 변환
        let joCode = input.jo;
        if (joCode && /제\d+조/.test(joCode)) {
            try {
                joCode = buildJO(joCode);
            }
            catch (e) {
                return {
                    content: [{
                            type: "text",
                            text: `조문 번호 변환 실패: ${e instanceof Error ? e.message : String(e)}`
                        }],
                    isError: true
                };
            }
        }
        // Check cache first (efYd 정규화: 미지정 → 'current'로 통일)
        const cacheKey = `lawtext:${input.mst || input.lawId}:${joCode || 'full'}:${input.efYd || 'current'}`;
        const cached = lawCache.get(cacheKey);
        if (cached) {
            return {
                content: [{
                        type: "text",
                        text: cached
                    }]
            };
        }
        // 전체 법령 JSON 캐싱 (다른 조문 요청 시에도 계층 추적 위해 재사용)
        const fullJsonCacheKey = `lawjson:${input.mst || input.lawId}:${input.efYd || 'current'}`;
        let jsonText = lawCache.get(fullJsonCacheKey);
        if (!jsonText) {
            // 계층 구조가 누락되는 eflaw 대신, 명시적으로 target="law" API 호출
            const extraParams = {};
            if (input.mst)
                extraParams.MST = input.mst;
            if (input.lawId)
                extraParams.ID = input.lawId;
            if (input.efYd)
                extraParams.efYd = input.efYd;
            jsonText = await apiClient.fetchApi({
                endpoint: "lawService.do",
                target: "law",
                type: "JSON",
                extraParams,
                apiKey: input.apiKey
            });
            lawCache.set(fullJsonCacheKey, jsonText, 24 * 60 * 60 * 1000);
        }
        const json = JSON.parse(jsonText);
        // JSON 구조 파싱 (LexDiff 방식 적용)
        const lawData = json?.법령;
        if (!lawData) {
            return {
                content: [{
                        type: "text",
                        text: "[NOT_FOUND] 법령 데이터를 찾을 수 없습니다.\n\n⚠️ 법제처 API가 해당 mst/lawId에 대해 데이터를 반환하지 않았습니다. LLM이 조문을 추측/생성하지 마세요. search_law로 유효한 mst를 먼저 확인하세요."
                    }],
                isError: true
            };
        }
        // 조문 범위 파싱 함수
        const extractArticleRange = (data) => {
            const rawUnits = data.조문?.조문단위;
            if (!rawUnits)
                return null;
            const units = Array.isArray(rawUnits) ? rawUnits : [rawUnits];
            const articleNumbers = [];
            for (const unit of units) {
                if (unit.조문여부 === "조문" && unit.조문번호) {
                    const num = parseInt(unit.조문번호, 10);
                    if (!isNaN(num))
                        articleNumbers.push(num);
                }
            }
            if (articleNumbers.length === 0)
                return null;
            return {
                min: Math.min(...articleNumbers),
                max: Math.max(...articleNumbers),
                count: articleNumbers.length
            };
        };
        const basicInfo = lawData.기본정보 || lawData;
        const lawName = basicInfo?.법령명_한글 || basicInfo?.법령명한글 || basicInfo?.법령명 || "알 수 없음";
        const promDate = basicInfo?.공포일자 || "";
        const effDate = basicInfo?.시행일자 || basicInfo?.최종시행일자 || "";
        let resultText = `법령명: ${lawName}\n`;
        if (promDate)
            resultText += `공포일: ${promDate}\n`;
        if (effDate)
            resultText += `시행일: ${effDate}\n`;
        resultText += `\n`;
        // 조문 내용 추출 (정확한 경로: 법령.조문.조문단위)
        // 주의: 조문단위는 배열 또는 객체일 수 있음
        const rawUnits = lawData.조문?.조문단위;
        let articleUnits = [];
        if (Array.isArray(rawUnits)) {
            articleUnits = rawUnits;
        }
        else if (rawUnits && typeof rawUnits === 'object') {
            articleUnits = [rawUnits]; // 단일 객체를 배열로 변환
        }
        if (articleUnits.length === 0) {
            // 조문 범위 확인
            const range = extractArticleRange(lawData);
            let errorMsg = resultText + "[NOT_FOUND] 조문 내용을 찾을 수 없습니다.\n⚠️ LLM은 조문을 추측/생성하지 말고 아래 안내대로 재조회하세요.";
            if (input.jo) {
                // 특정 조문 요청했는데 없는 경우
                if (range) {
                    errorMsg += `\n\n이 법령은 제${range.min}조~제${range.max}조까지 총 ${range.count}개 조문만 존재합니다.`;
                    errorMsg += `\n\n해결 방법:`;
                    errorMsg += `\n   1. 전체 조회:`;
                    if (input.mst) {
                        errorMsg += `\n      get_law_text(mst="${input.mst}")`;
                    }
                    else if (input.lawId) {
                        errorMsg += `\n      get_law_text(lawId="${input.lawId}")`;
                    }
                    errorMsg += `\n\n   2. 유사 조문 조회 예시:`;
                    const suggestJo = Math.max(1, range.max - 3);
                    if (input.mst) {
                        errorMsg += `\n      get_law_text(mst="${input.mst}", jo="제${range.max}조")`;
                        errorMsg += `\n      get_law_text(mst="${input.mst}", jo="제${suggestJo}조")`;
                    }
                    else if (input.lawId) {
                        errorMsg += `\n      get_law_text(lawId="${input.lawId}", jo="제${range.max}조")`;
                        errorMsg += `\n      get_law_text(lawId="${input.lawId}", jo="제${suggestJo}조")`;
                    }
                    errorMsg += `\n\n   3. 키워드 검색:`;
                    errorMsg += `\n      search_all(query="${lawName.replace(/\s+(시행령|시행규칙)/, '')}")`;
                }
                else {
                    errorMsg += `\n\n[NOT_FOUND] 조문을 찾을 수 없습니다. 다음을 시도해보세요:`;
                    errorMsg += `\n   - 전체 법령 조회 (jo 파라미터 생략)`;
                    errorMsg += `\n   - 키워드 검색 (search_all 도구 사용)`;
                }
            }
            return {
                content: [{
                        type: "text",
                        text: errorMsg
                    }],
                isError: true
            };
        }
        // 조문 미지정 시 전체 법령 대신 목차(조문 제목 목록)만 반환
        // 대형 법령(국가공무원법 등)의 "too large content" 에러 방지
        if (!input.jo && articleUnits.length > 20) {
            const tocItems = [];
            let articleCount = 0;
            for (const unit of articleUnits) {
                const unitType = unit.조문여부?.trim();
                let unitTitle = unit.조문제목?.trim() || "";
                if (!unitTitle && unit.조문내용) {
                    unitTitle = flattenContent(unit.조문내용).replace(/<[^>]+>/g, '').trim();
                }
                if (unitType === "편" || unitType === "장" || unitType === "절" || unitType === "관") {
                    tocItems.push(`\n[${unitTitle}]`);
                }
                else if (unitType === "전문") {
                    let rawStr = typeof unit.조문내용 === "string" ? unit.조문내용 : JSON.stringify(unit.조문내용 || "");
                    const fragments = String(rawStr).replace(/<[^>]+>/g, " ").split(/["'\[\],]|\\[rn]|<br>/i).map((s) => s.trim()).filter(Boolean);
                    for (const frag of fragments) {
                        if (/^제\s*\d+\s*(편|장|절|관)/.test(frag)) {
                            tocItems.push(`\n[${frag}]`);
                        }
                    }
                }
                else if (unitType === "조문") {
                    articleCount++;
                    const joNum = unit.조문번호 || "";
                    const joBranch = unit.조문가지번호 || "";
                    const joTitle = unit.조문제목 || "";
                    if (joNum) {
                        const displayNum = joBranch && joBranch !== "0" ? `제${joNum}조의${joBranch}` : `제${joNum}조`;
                        tocItems.push(`${displayNum}${joTitle ? ` ${joTitle}` : ""}`);
                    }
                }
            }
            let tocText = resultText;
            tocText += `목차 (총 ${articleCount}개 조문)\n`;
            tocText += tocItems.join("\n").trim();
            tocText += `\n\n특정 조문 조회: get_law_text(`;
            if (input.mst) {
                tocText += `mst="${input.mst}", jo="제XX조")`;
            }
            else if (input.lawId) {
                tocText += `lawId="${input.lawId}", jo="제XX조")`;
            }
            tocText += `\n여러 조문 일괄 조회: get_batch_articles 도구 사용`;
            lawCache.set(cacheKey, tocText);
            return {
                content: [{
                        type: "text",
                        text: truncateResponse(tocText)
                    }]
            };
        }
        if (input.jo) {
            let currentPyeon = "", currentJang = "", currentJeol = "", currentGwan = "";
            let foundArticle = false;
            for (const unit of articleUnits) {
                const unitType = unit.조문여부?.trim();
                let unitTitle = unit.조문제목?.trim() || "";
                // 조문내용이 배열이나 객체일 때를 대비해 flattenContent로 안전하게 텍스트만 추출
                if (!unitTitle && unit.조문내용) {
                    unitTitle = flattenContent(unit.조문내용).replace(/<[^>]+>/g, '').trim();
                }
                // 상위 계층이 바뀌면 하위 계층 초기화
                if (unitType === "편") {
                    currentPyeon = unitTitle;
                    currentJang = currentJeol = currentGwan = "";
                }
                else if (unitType === "장") {
                    currentJang = unitTitle;
                    currentJeol = currentGwan = "";
                }
                else if (unitType === "절") {
                    currentJeol = unitTitle;
                    currentGwan = "";
                }
                else if (unitType === "관") {
                    currentGwan = unitTitle;
                }
                else if (unitType === "전문") {
                    // "전문" 안에 편장절관이 텍스트 배열로 들어있는 경우 (예: 민법, 산업안전보건법 등)
                    let rawStr = typeof unit.조문내용 === "string" ? unit.조문내용 : JSON.stringify(unit.조문내용 || "");
                    const fragments = String(rawStr).replace(/<[^>]+>/g, " ").split(/["'\[\],]|\\[rn]|<br>/i).map((s) => s.trim()).filter(Boolean);
                    for (const frag of fragments) {
                        if (/^제\s*\d+\s*편/.test(frag)) {
                            currentPyeon = frag;
                            currentJang = currentJeol = currentGwan = "";
                        }
                        else if (/^제\s*\d+\s*장/.test(frag)) {
                            currentJang = frag;
                            currentJeol = currentGwan = "";
                        }
                        else if (/^제\s*\d+\s*절/.test(frag)) {
                            currentJeol = frag;
                            currentGwan = "";
                        }
                        else if (/^제\s*\d+\s*관/.test(frag)) {
                            currentGwan = frag;
                        }
                    }
                }
                if (unitType !== "조문")
                    continue;
                const joNum = unit.조문번호 || "";
                const joBranch = unit.조문가지번호 || "";
                const unitJoCode = joNum.padStart(4, "0") + (joBranch || "00").padStart(2, "0");
                if (unitJoCode === joCode || joNum === input.jo.replace(/[^0-9]/g, '')) {
                    foundArticle = true;
                    const h = [currentPyeon, currentJang, currentJeol, currentGwan].filter(Boolean);
                    if (h.length > 0)
                        resultText += `[위치: ${h.join(" > ")}]\n`;
                    const formatted = formatArticleUnit(unit);
                    if (formatted) {
                        if (formatted.header)
                            resultText += `${formatted.header}\n`;
                        if (formatted.body)
                            resultText += `${formatted.body}\n\n`;
                    }
                    break;
                }
            }
            if (!foundArticle) {
                // articleUnits.length === 0 처리부의 로직과 동일하게 NOT_FOUND 반환
                let errorMsg = resultText + "[NOT_FOUND] 조문 내용을 찾을 수 없습니다.\n⚠️ LLM은 조문을 추측/생성하지 말고 아래 안내대로 재조회하세요.";
                const range = extractArticleRange(lawData);
                if (range)
                    errorMsg += `\n\n이 법령은 제${range.min}조~제${range.max}조까지 총 ${range.count}개 조문만 존재합니다.`;
                return { content: [{ type: "text", text: errorMsg }], isError: true };
            }
        }
        else {
            for (const unit of articleUnits) {
                const unitType = unit.조문여부?.trim();
                let unitTitle = unit.조문제목?.trim() || "";
                if (!unitTitle && unit.조문내용) {
                    unitTitle = flattenContent(unit.조문내용).replace(/<[^>]+>/g, '').trim();
                }
                if (unitType === "편" || unitType === "장" || unitType === "절" || unitType === "관") {
                    resultText += `\n[${unitTitle}]\n`;
                }
                else if (unitType === "전문") {
                    let rawStr = typeof unit.조문내용 === "string" ? unit.조문내용 : JSON.stringify(unit.조문내용 || "");
                    const fragments = String(rawStr).replace(/<[^>]+>/g, " ").split(/["'\[\],]|\\[rn]|<br>/i).map((s) => s.trim()).filter(Boolean);
                    for (const frag of fragments) {
                        if (/^제\s*\d+\s*(편|장|절|관)/.test(frag)) {
                            resultText += `\n[${frag}]\n`;
                        }
                    }
                }
                const formatted = formatArticleUnit(unit);
                if (!formatted)
                    continue;
                if (formatted.header)
                    resultText += `${formatted.header}\n`;
                if (formatted.body)
                    resultText += `${formatted.body}\n\n`;
            }
        }
        // 응답 크기 제한 - 조문 경계에서 자르기 (mid-article 절단 방지)
        if (resultText.length > MAX_RESPONSE_SIZE) {
            const totalArticles = articleUnits.filter(u => u.조문여부 === "조문").length;
            // 조문 헤더 위치를 역순으로 찾아서 MAX_RESPONSE_SIZE 이내의 마지막 완전한 조문 경계에서 자르기
            const articleHeaderPattern = /^제\d+조(?:의\d+)?/gm;
            let lastSafePos = 0;
            let includedCount = 0;
            let match;
            while ((match = articleHeaderPattern.exec(resultText)) !== null) {
                if (match.index > MAX_RESPONSE_SIZE - 200)
                    break; // 200자 여유 (안내 메시지용)
                lastSafePos = match.index;
                includedCount++;
            }
            // 마지막 조문 이후의 내용도 포함 (조문 본문)
            if (lastSafePos > 0 && includedCount > 0) {
                // 다음 조문 헤더 전까지 또는 끝까지
                const nextArticlePattern = /^제\d+조(?:의\d+)?/gm;
                nextArticlePattern.lastIndex = lastSafePos + 1;
                const nextMatch = nextArticlePattern.exec(resultText);
                const cutPos = nextMatch && nextMatch.index <= MAX_RESPONSE_SIZE - 200
                    ? nextMatch.index
                    : Math.min(resultText.length, MAX_RESPONSE_SIZE - 200);
                resultText = resultText.slice(0, cutPos);
            }
            else {
                resultText = resultText.slice(0, MAX_RESPONSE_SIZE - 200);
            }
            // 포함된 조문 번호 추출
            const includedArticles = [];
            const finalHeaderPattern = /^(제\d+조(?:의\d+)?)/gm;
            let m;
            while ((m = finalHeaderPattern.exec(resultText)) !== null) {
                includedArticles.push(m[1]);
            }
            const first = includedArticles[0] || "?";
            const last = includedArticles[includedArticles.length - 1] || "?";
            resultText += `\n\n[응답 크기 제한] ${totalArticles}개 조문 중 ${includedArticles.length}개만 포함 (${first}~${last})`;
            resultText += `\n나머지 조문 조회: get_law_text(`;
            if (input.mst) {
                resultText += `mst="${input.mst}", jo="제XX조")`;
            }
            else if (input.lawId) {
                resultText += `lawId="${input.lawId}", jo="제XX조")`;
            }
            resultText += `\n여러 조문 일괄 조회: get_batch_articles 도구 사용`;
        }
        // Cache the result
        lawCache.set(cacheKey, resultText);
        return {
            content: [{
                    type: "text",
                    text: resultText
                }]
        };
    }
    catch (error) {
        return formatToolError(error, "get_law_text");
    }
}
