/**
 * search_law Tool - 법령 검색
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const SearchLawSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchLawInput = z.infer<typeof SearchLawSchema>;
export declare function searchLaw(apiClient: LawApiClient, input: SearchLawInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
