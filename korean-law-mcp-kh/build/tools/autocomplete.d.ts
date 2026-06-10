/**
 * suggest_law_names Tool - 법령명 자동완성
 * 부분 입력에 대해 가능한 법령명을 제안
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const SuggestLawNamesSchema: z.ZodObject<{
    partial: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SuggestLawNamesInput = z.infer<typeof SuggestLawNamesSchema>;
export declare function suggestLawNames(apiClient: LawApiClient, input: SuggestLawNamesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
