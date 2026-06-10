/**
 * Knowledge Base 공통 유틸리티
 */
export { extractTag } from "../lib/xml-parser.js";
/**
 * KB XML 응답 파싱
 */
export interface KBItem {
    법령용어명?: string;
    용어명?: string;
    법령용어ID?: string;
    동음이의어?: boolean;
    용어간관계링크?: string;
    조문간관계링크?: string;
    법령명?: string;
    법령ID?: string;
    조문번호?: string;
    조문제목?: string;
    관계유형?: string;
    법령종류?: string;
    연계용어명?: string;
    일상용어명?: string;
}
export interface KBParseResult {
    totalCnt: string;
    data: KBItem[];
}
export declare function parseKBXML(xml: string, _rootTag: string): KBParseResult;
/**
 * 용어 검색 폴백
 */
export declare function fallbackTermSearch(apiClient: Pick<import("../lib/api-client.js").LawApiClient, "fetchApi">, term: string, termType: string): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
