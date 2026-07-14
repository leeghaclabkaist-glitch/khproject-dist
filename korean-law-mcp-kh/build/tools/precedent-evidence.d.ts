import type { LawApiClient } from "../lib/api-client.js";
import type { PrecedentHit, PrecedentSearchValidationInput, StructuredPrecedentSearchResult } from "./precedent-search-core.js";
export declare const DEFAULT_PRECEDENT_DETAIL_LIMIT = 2;
export declare const MAX_PRECEDENT_DETAIL_LIMIT = 5;
export interface PrecedentEvidenceOptions {
    apiKey?: string;
    detailLimit?: number;
    full?: boolean;
}
export interface PrecedentEvidenceItem {
    hit: PrecedentHit;
    text: string;
    isError: boolean;
    detailError?: string;
}
export interface PrecedentEvidenceResult {
    text: string;
    isError: boolean;
    items: PrecedentEvidenceItem[];
}
export declare function validatePrecedentSearchResult(apiClient: LawApiClient, input: PrecedentSearchValidationInput, options?: PrecedentEvidenceOptions): Promise<boolean>;
export declare function fetchPrecedentEvidence(apiClient: LawApiClient, searchResult: StructuredPrecedentSearchResult, options?: PrecedentEvidenceOptions): Promise<PrecedentEvidenceResult | null>;
