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
