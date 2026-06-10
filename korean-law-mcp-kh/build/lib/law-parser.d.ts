/**
 * 법령 조문 번호 파싱 및 변환 유틸리티
 * LexDiff에서 이식 (debugLogger 제거)
 */
export interface ParsedSearchQuery {
    lawName: string;
    article?: string;
    jo?: string;
    clause?: string;
    item?: string;
    subItem?: string;
}
/**
 * Converts Korean law article notation to 6-digit JO code (법률/시행령/시행규칙용)
 * Format: AAAABB (AAAA=article, BB=branch)
 * Examples:
 *   "38조" → "003800"
 *   "10조의2" → "001002"
 *   "제5조" → "000500"
 */
export declare function buildJO(input: string): string;
/**
 * Converts Korean ordinance article notation to 6-digit JO code (자치법규용)
 * Format: AABBCC (AA=article, BB=branch, CC=sub)
 * Examples:
 *   "제1조" → "010000"
 *   "제1조의1" → "010100"
 *   "제10조의2" → "100200"
 */
export declare function buildOrdinanceJO(input: string): string;
/**
 * Formats JO code back to readable Korean
 * Examples:
 *   Law format (AAAABB): "003800" → "제38조", "001002" → "제10조의2"
 *   Ordinance format (AABBCC): "010000" → "제1조", "010100" → "제1조의1"
 *   Legacy 8-digit (AAAABBCC): "00380001" → "제38조-1"
 */
export declare function formatJO(jo: string, isOrdinance?: boolean): string;
/**
 * Normalizes law article notation
 */
export declare function normalizeArticle(article: string): string;
/**
 * Parses search query to extract law name and article
 */
export declare function parseSearchQuery(query: string): ParsedSearchQuery;
