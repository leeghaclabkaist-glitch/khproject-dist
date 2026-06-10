/**
 * get_article_detail Tool - 조항호목 단위 정밀 조회
 */
import { z } from "zod";
import { truncateResponse } from "../lib/schemas.js";
import { lawCache } from "../lib/cache.js";
import { buildJO } from "../lib/law-parser.js";
import { cleanHtml, flattenContent } from "../lib/article-parser.js";
import { formatToolError } from "../lib/errors.js";
export const GetArticleDetailSchema = z.object({
    mst: z.string().optional().describe("법령일련번호 (search_law에서 획득)"),
    lawId: z.string().optional().describe("법령ID (search_law에서 획득)"),
    jo: z.string().describe("조문 번호 (예: '제38조' 또는 '003800')"),
    hang: z.string().optional().describe("항 번호 (예: '2')"),
    ho: z.string().optional().describe("호 번호 (예: '3')"),
    mok: z.string().optional().describe("목 번호 (예: '1')"),
    apiKey: z.string().optional().describe("법제처 Open API 인증키(OC). 사용자가 제공한 경우 전달")
}).refine(data => data.mst || data.lawId, {
    message: "mst 또는 lawId 중 하나는 필수입니다"
});
export async function getArticleDetail(apiClient, input) {
    try {
        // 조문 번호가 한글이면 JO 코드로 변환
        let joCode = input.jo;
        if (/제\d+조/.test(joCode)) {
            joCode = buildJO(joCode);
        }
        // HANG, HO 파라미터를 API가 요구하는 6자리 포맷으로 변환 (예: 2 -> 000200, 10의2 -> 001002)
        const formatSubNumber = (val) => {
            const v = val.replace(/^제/, '').replace(/[항호]$/, '').trim();
            if (/^\d{6}$/.test(v))
                return v;
            const match = v.match(/^(\d+)(?:의(\d+))?$/);
            if (match) {
                return match[1].padStart(4, "0") + (match[2] || "0").padStart(2, "0");
            }
            return v;
        };
        const extraParams = {};
        if (input.mst)
            extraParams.MST = String(input.mst);
        if (input.lawId)
            extraParams.ID = String(input.lawId);
        extraParams.JO = String(joCode);
        if (input.hang)
            extraParams.HANG = formatSubNumber(input.hang);
        if (input.ho)
            extraParams.HO = formatSubNumber(input.ho);
        if (input.mok)
            extraParams.MOK = String(input.mok);
        const jsonText = await apiClient.fetchApi({
            endpoint: "lawService.do",
            target: "eflawjosub",
            type: "JSON",
            extraParams,
            apiKey: input.apiKey || "kafaleekh"
        });
        const json = JSON.parse(jsonText);
        const lawData = json?.법령;
        if (!lawData) {
            return {
                content: [{ type: "text", text: "[NOT_FOUND] 법령 데이터를 찾을 수 없습니다.\n⚠️ LLM은 조문을 추측하지 마세요." }],
                isError: true
            };
        }
        // eflawjosub 응답은 lawData가 배열일 수 있으므로 유연하게 처리
        const basicInfo = Array.isArray(lawData) ? lawData[0] : (lawData.기본정보 || lawData);
        const lawName = basicInfo?.법령명_한글 || basicInfo?.법령명한글 || basicInfo?.법령명 || "알 수 없음";
        // 전체 법령 캐시를 통해 편장절관 계층구조(위치) 파악
        let hierarchyText = "";
        try {
            const fullJsonCacheKey = `lawjson:${input.mst || input.lawId}:current`;
            let fullJsonText = lawCache.get(fullJsonCacheKey);
            if (!fullJsonText) {
                const extraParams = {};
                if (input.mst)
                    extraParams.MST = input.mst;
                if (input.lawId)
                    extraParams.ID = input.lawId;
                fullJsonText = await apiClient.fetchApi({
                    endpoint: "lawService.do",
                    target: "law",
                    type: "JSON",
                    extraParams,
                    apiKey: input.apiKey || "kafaleekh"
                });
                lawCache.set(fullJsonCacheKey, fullJsonText, 24 * 60 * 60 * 1000);
            }
            const fullData = JSON.parse(fullJsonText);
            const rawUnits = fullData?.법령?.조문?.조문단위;
            const units = Array.isArray(rawUnits) ? rawUnits : rawUnits ? [rawUnits] : [];
            let currentPyeon = "", currentJang = "", currentJeol = "", currentGwan = "";
            for (const unit of units) {
                const unitType = unit.조문여부?.trim();
                let unitTitle = unit.조문제목?.trim() || "";
                if (!unitTitle && unit.조문내용) {
                    unitTitle = flattenContent(unit.조문내용).replace(/<[^>]+>/g, '').trim();
                }
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
                else if (unitType === "조문") {
                    const joNum = unit.조문번호 || "";
                    const joBranch = unit.조문가지번호 || "";
                    const unitJoCode = joNum.padStart(4, "0") + (joBranch || "00").padStart(2, "0");
                    if (unitJoCode === joCode || joNum === input.jo.replace(/[^0-9]/g, '')) {
                        const h = [currentPyeon, currentJang, currentJeol, currentGwan].filter(Boolean);
                        if (h.length > 0)
                            hierarchyText = `[위치: ${h.join(" > ")}]\n`;
                        break;
                    }
                }
            }
        }
        catch (e) {
            // 계층 정보 추출 실패 무시
        }
        // 조회 위치 표시
        let locationLabel = `제${input.jo.replace(/^제/, "").replace(/조$/, "")}조`;
        if (/^\d{4,6}$/.test(input.jo))
            locationLabel = `JO=${input.jo}`;
        if (input.hang)
            locationLabel += ` 제${input.hang}항`;
        if (input.ho)
            locationLabel += ` 제${input.ho}호`;
        if (input.mok)
            locationLabel += ` ${input.mok}목`;
        let resultText = `법령명: ${lawName}\n`;
        if (hierarchyText) {
            resultText += hierarchyText;
        }
        resultText += `조회 위치: ${locationLabel}\n\n`;
        // 조문 추출
        const rawUnits = lawData.조문?.조문단위 || (Array.isArray(lawData) ? lawData : [lawData]);
        const articleUnits = Array.isArray(rawUnits) ? rawUnits : rawUnits ? [rawUnits] : [];
        if (articleUnits.length === 0) {
            return {
                content: [{ type: "text", text: resultText + "[NOT_FOUND] 해당 조문을 찾을 수 없습니다.\n⚠️ LLM은 조문 내용을 추측/생성하지 마세요." }],
                isError: true
            };
        }
        for (const unit of articleUnits) {
            // eflawjosub 응답에 조문여부가 생략될 수 있으므로, 명시적으로 다른 타입인 경우만 스킵
            if (unit.조문여부 && unit.조문여부 !== "조문")
                continue;
            const joNum = unit.조문번호 || "";
            const joBranch = unit.조문가지번호 || "";
            const joTitle = unit.조문제목 || "";
            const displayNum = joBranch && joBranch !== "0" ? `제${joNum}조의${joBranch}` : `제${joNum}조`;
            resultText += `${displayNum}`;
            if (joTitle)
                resultText += ` ${joTitle}`;
            resultText += `\n`;
            // 조문내용
            if (unit.조문내용) {
                const content = typeof unit.조문내용 === "string" ? unit.조문내용 : String(unit.조문내용);
                resultText += `${cleanHtml(content)}\n`;
            }
            // 평탄화된 응답 구조 지원 (eflawjosub의 경우 항/호/목 내용이 직렬화되어 반환될 수 있음)
            if (unit.항내용 && !unit.항) {
                resultText += `  ${unit.항번호 ? `(${unit.항번호}) ` : ""}${cleanHtml(String(unit.항내용))}\n`;
            }
            if (unit.호내용 && !unit.호) {
                resultText += `    ${unit.호번호 ? `${unit.호번호}. ` : ""}${cleanHtml(String(unit.호내용))}\n`;
            }
            if (unit.목내용 && !unit.목) {
                resultText += `      ${unit.목번호 ? `${unit.목번호}. ` : ""}${cleanHtml(String(unit.목내용))}\n`;
            }
            // 항 내용
            if (unit.항) {
                const hangList = Array.isArray(unit.항) ? unit.항 : [unit.항];
                for (const hang of hangList) {
                    const hangNum = hang.항번호 || "";
                    const hangContent = hang.항내용 || "";
                    if (hangContent) {
                        resultText += `  ${hangNum ? `(${hangNum})` : ""} ${cleanHtml(hangContent)}\n`;
                    }
                    if (hang.호) {
                        const hoList = Array.isArray(hang.호) ? hang.호 : [hang.호];
                        for (const ho of hoList) {
                            const hoNum = ho.호번호 || "";
                            const hoContent = ho.호내용 || "";
                            if (hoContent) {
                                resultText += `    ${hoNum}. ${cleanHtml(hoContent)}\n`;
                            }
                            if (ho.목) {
                                const mokList = Array.isArray(ho.목) ? ho.목 : [ho.목];
                                for (const mok of mokList) {
                                    const mokNum = mok.목번호 || "";
                                    const mokContent = mok.목내용 || "";
                                    if (mokContent) {
                                        resultText += `      ${mokNum}. ${cleanHtml(mokContent)}\n`;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            resultText += `\n`;
        }
        return {
            content: [{ type: "text", text: truncateResponse(resultText) }]
        };
    }
    catch (error) {
        return formatToolError(error, "get_article_detail");
    }
}
