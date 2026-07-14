import type { AiLawArticleSignal } from "./life-law.js";
export type CompactQuerySource = "case_number" | "original_query" | "original_keyword" | "document_hint" | "ai_law_article_title" | "ai_law_law_article_title" | "router";
export type PrecedentSearchScope = 1 | 2;
export type CompactQueryVariantKind = "case_number" | "original_query" | "original_keyword" | "document_hint" | "raw" | "terminal_function_word_removed" | "terminal_function_word_spaced" | "law_title" | "router";
export interface CompactQueryCandidate {
    query: string;
    source: CompactQuerySource;
    score: number;
    reason: string;
    search: PrecedentSearchScope;
    semanticAnchor?: string;
    validationTermGroups?: string[][];
    variantKind: CompactQueryVariantKind;
    requiresResultValidation: boolean;
}
interface RouteLike {
    params?: Record<string, unknown>;
    pipeline?: Array<{
        params?: Record<string, unknown>;
    }>;
}
export interface CompactQueryInput {
    originalQuery: string;
    includeOriginal?: boolean;
    caseNumber?: string;
    documentHints?: string[];
    aiLawArticles?: AiLawArticleSignal[];
    route?: RouteLike;
    max?: number;
}
export declare function buildCompactLegalQueries(input: CompactQueryInput): CompactQueryCandidate[];
export {};
