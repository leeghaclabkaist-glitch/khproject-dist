import type { LawApiClient } from "../lib/api-client.js";
import type { AiLawArticleSignal } from "./life-law.js";
import type { SearchPrecedentsInput } from "./precedents.js";
export type PrecedentSearchMode = 1 | 2;
export interface PrecedentSearchAttempt {
    query?: string;
    caseNumber?: string;
    search?: PrecedentSearchMode;
    fromDate?: string;
    toDate?: string;
    reason: string;
    totalCount: number;
    hitCount: number;
    success: boolean;
    outOfRequestedDateRange?: boolean;
    semanticAnchor?: string;
    validationTermGroups?: string[][];
    requiresResultValidation?: boolean;
    validationFailed?: boolean;
    error?: string;
}
export interface PrecedentHit {
    id: string;
    title: string;
    caseNumber?: string;
    court?: string;
    date?: string;
    decisionType?: string;
    link?: string;
    sourceQuery?: string;
    semanticAnchor?: string;
    searchMode: PrecedentSearchMode;
    outOfRequestedDateRange?: boolean;
}
export interface StructuredPrecedentSearchResult {
    originalArgs: SearchPrecedentsInput;
    totalCount: number;
    page: number;
    hits: PrecedentHit[];
    attempts: PrecedentSearchAttempt[];
    fallbackUsed: boolean;
    successfulAttempt?: PrecedentSearchAttempt;
}
export interface PrecedentSearchContext {
    aiLawArticles?: AiLawArticleSignal[];
    route?: {
        params?: Record<string, unknown>;
        pipeline?: Array<{
            params?: Record<string, unknown>;
        }>;
    };
    documentHints?: string[];
    fallbackPolicy?: "full" | "body" | "none";
    maxFallbackAttempts?: number;
    validateResult?: (input: PrecedentSearchValidationInput) => boolean | Promise<boolean>;
}
export interface PrecedentSearchValidationInput {
    originalArgs: SearchPrecedentsInput;
    attempt: PrecedentSearchAttempt;
    hits: PrecedentHit[];
}
export declare function searchPrecedentsStructured(apiClient: LawApiClient, args: SearchPrecedentsInput, context?: PrecedentSearchContext): Promise<StructuredPrecedentSearchResult>;
