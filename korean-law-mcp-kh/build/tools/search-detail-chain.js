import { SEARCH_DETAIL_CHAINS } from "../lib/tool-chain-config.js";
import { getPrecedentText } from "./precedents.js";
import { getInterpretationText } from "./interpretations.js";
import { getTaxTribunalDecisionText } from "./tax-tribunal-decisions.js";
import { getCustomsInterpretationText } from "./customs-interpretations.js";
import { getConstitutionalDecisionText } from "./constitutional-decisions.js";
import { getAdminAppealText } from "./admin-appeals.js";
import { getFtcDecisionText, getPipcDecisionText, getNlrcDecisionText } from "./committee-decisions.js";
import { getEnglishLawText } from "./english-law.js";
import { getAdminRule } from "./admin-rule.js";
import { getOrdinance } from "./ordinance.js";
const DETAIL_HANDLERS = {
    get_precedent_text: getPrecedentText,
    get_interpretation_text: getInterpretationText,
    get_tax_tribunal_decision_text: getTaxTribunalDecisionText,
    get_customs_interpretation_text: getCustomsInterpretationText,
    get_constitutional_decision_text: getConstitutionalDecisionText,
    get_admin_appeal_text: getAdminAppealText,
    get_ftc_decision_text: getFtcDecisionText,
    get_pipc_decision_text: getPipcDecisionText,
    get_nlrc_decision_text: getNlrcDecisionText,
    get_english_law_text: getEnglishLawText,
    get_admin_rule: getAdminRule,
    get_ordinance: getOrdinance,
};
const FULL_FALSE_DETAIL_TOOLS = new Set([
    "get_precedent_text",
    "get_constitutional_decision_text",
    "get_admin_appeal_text",
]);
function defaultLimit(searchTool) {
    return searchTool === "search_precedents" ? 2 : 1;
}
function makeGlobalRegex(regex) {
    const flags = regex.flags.includes("g") ? regex.flags : `${regex.flags}g`;
    return new RegExp(regex.source, flags);
}
export function extractDetailIds(searchTool, output, limit) {
    const chain = SEARCH_DETAIL_CHAINS[searchTool];
    if (!chain || !output.trim())
        return [];
    const max = limit ?? defaultLimit(searchTool);
    const regex = makeGlobalRegex(chain.idRegex);
    const seen = new Set();
    const ids = [];
    let match;
    while ((match = regex.exec(output)) !== null) {
        const id = match[1]?.trim();
        if (!id || seen.has(id))
            continue;
        seen.add(id);
        ids.push(id);
        if (ids.length >= max)
            break;
    }
    return ids;
}
async function callDetailTool(apiClient, searchTool, id, options) {
    const chain = SEARCH_DETAIL_CHAINS[searchTool];
    const handler = chain ? DETAIL_HANDLERS[chain.detailTool] : undefined;
    if (!chain || !handler) {
        return { text: `상세조회 도구를 찾을 수 없습니다: ${searchTool}`, isError: true };
    }
    const input = { [chain.detailParam]: id };
    if (options.apiKey)
        input.apiKey = options.apiKey;
    if (FULL_FALSE_DETAIL_TOOLS.has(chain.detailTool))
        input.full = false;
    try {
        const result = await handler(apiClient, input);
        return {
            text: result.content?.map(item => item.text).join("\n") || "",
            isError: !!result.isError,
        };
    }
    catch (error) {
        return {
            text: `오류: ${error instanceof Error ? error.message : String(error)}`,
            isError: true,
        };
    }
}
function header(searchTool, count) {
    const chain = SEARCH_DETAIL_CHAINS[searchTool];
    const fullSuffix = searchTool === "search_precedents" ? ", full=false" : "";
    return `자동 상세조회: ${searchTool} -> ${chain.detailTool} (상위 ${count}건${fullSuffix})`;
}
export async function fetchSearchDetailChain(apiClient, searchTool, searchResult, options = {}) {
    const chain = SEARCH_DETAIL_CHAINS[searchTool];
    if (!chain || searchResult.isError)
        return null;
    const ids = extractDetailIds(searchTool, searchResult.text, options.limit);
    if (ids.length === 0)
        return null;
    const blocks = [header(searchTool, ids.length)];
    const details = await Promise.all(ids.map(async (id) => ({
        id,
        detail: await callDetailTool(apiClient, searchTool, id, options),
    })));
    const failures = details.filter(({ detail }) => detail.isError).length;
    for (const { id, detail } of details) {
        blocks.push(`[${id}]\n${detail.text || "상세조회 결과가 비어 있습니다."}`);
    }
    return {
        text: blocks.join("\n\n"),
        isError: failures === ids.length,
    };
}
export async function fetchCombinedSearchDetailChain(apiClient, searchTool, searchResults, options = {}) {
    const combined = searchResults
        .filter(result => !result.isError && result.text.trim())
        .map(result => result.text)
        .join("\n");
    if (!combined.trim())
        return null;
    return fetchSearchDetailChain(apiClient, searchTool, { text: combined, isError: false }, options);
}
