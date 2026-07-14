/**
 * 법령 검색어 정규화 및 약칭 해결
 * LexDiff에서 이식 (debugLogger 제거)
 */
export interface LawAliasResolution {
    canonical: string;
    matchedAlias?: string;
    alternatives: string[];
}
export declare function normalizeAliasKey(value: string): string;
export declare function normalizeLawSearchText(input: string): string;
export declare function resolveLawAlias(lawName: string): LawAliasResolution;
/**
 * Query 안에 약어가 부분 문자열로 끼어 있는 경우, 풀네임으로 치환된 변형을 반환.
 *
 * 예:
 *   "화관법 제5조"     → ["화학물질관리법 제5조"]
 *   "화관법 시행령"    → ["화학물질관리법 시행령"]
 *   "산안법 위반 사례" → ["산업안전보건법 위반 사례"]
 *   "중처법 제4조 책임" → ["중대재해 처벌 등에 관한 법률 제4조 책임"]
 *
 * 매칭 원칙 (stats-mcp의 extractKeyword 패턴 차용):
 *   - 긴 alias 우선 매칭 (충돌 방지)
 *   - alias 길이 2자 이상만 부분 매칭 (오탐 방지)
 *   - 동일 canonical 중복 방지
 *   - matchedAlias가 query의 전체와 같으면 (정확 매칭은 resolveLawAlias가 처리하므로) 제외
 */
export interface EmbeddedAliasMatch {
    alias: string;
    canonical: string;
    alternatives: string[];
    expandedQuery: string;
}
export declare function extractEmbeddedAliases(query: string): EmbeddedAliasMatch[];
export interface ExpandedQueries {
    original: string;
    expanded: string[];
}
/**
 * 자치법규 검색어 확장
 * 구/군 이름 → 광역시/도 + 구/군 형태로 확장
 */
export declare function expandOrdinanceQuery(query: string): ExpandedQueries;
/**
 * 일반 법령 검색어 확장
 */
export declare function expandLawQuery(query: string): ExpandedQueries;
