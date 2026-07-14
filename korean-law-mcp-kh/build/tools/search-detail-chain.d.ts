import type { LawApiClient } from "../lib/api-client.js";
export interface SearchDetailCallResult {
    text: string;
    isError: boolean;
}
export interface SearchDetailOptions {
    apiKey?: string;
    limit?: number;
}
export declare function extractDetailIds(searchTool: string, output: string, limit?: number): string[];
export declare function fetchSearchDetailChain(apiClient: LawApiClient, searchTool: string, searchResult: SearchDetailCallResult, options?: SearchDetailOptions): Promise<SearchDetailCallResult | null>;
export declare function fetchCombinedSearchDetailChain(apiClient: LawApiClient, searchTool: string, searchResults: SearchDetailCallResult[], options?: SearchDetailOptions): Promise<SearchDetailCallResult | null>;
