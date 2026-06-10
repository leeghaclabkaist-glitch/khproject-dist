/**
 * 문서 리스크 분석 규칙 엔진
 *
 * 문서 유형 분류, 리스크 규칙 매칭, 금액/기간 추출, 조항 충돌 탐지
 */
export type DocType = "employment" | "lease" | "service" | "general" | "investment" | "nda" | "license" | "construction";
export declare const DOC_LABELS: Record<DocType, string>;
export declare function classifyDocument(text: string): DocType;
export interface Clause {
    label: string;
    body: string;
}
export declare function extractClauses(text: string, max: number): Clause[];
export interface RiskRule {
    id: string;
    name: string;
    requires: string[];
    anyOf?: string[];
    severity: "high" | "medium";
    description: string;
    searchHints: string[];
}
export declare const RISK_RULES: RiskRule[];
export declare function matchRule(rule: RiskRule, text: string): boolean;
export type RiskGrade = "safe" | "caution" | "warning" | "danger";
export declare function computeRiskScore(findings: {
    severity: "high" | "medium";
}[]): {
    score: number;
    grade: RiskGrade;
    gradeLabel: string;
};
export interface ExtractedAmount {
    label: string;
    value: string;
}
export interface ExtractedPeriod {
    label: string;
    value: string;
}
export declare function extractAmounts(text: string): ExtractedAmount[];
export declare function extractPeriods(text: string): ExtractedPeriod[];
export interface ConflictResult {
    type: string;
    description: string;
    clauseA?: string;
    clauseB?: string;
}
export declare function detectConflicts(clauses: Clause[]): ConflictResult[];
/** 전문 텍스트 대상 충돌 탐지 (조항 구분 불가 시) */
export declare function detectConflictsInText(text: string): ConflictResult[];
export declare const SEARCH_SUGGESTIONS: Record<DocType, string[]>;
