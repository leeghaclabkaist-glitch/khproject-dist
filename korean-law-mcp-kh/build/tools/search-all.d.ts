/**
 * search_all Tool - 통합 검색
 * 법령, 행정규칙, 자치법규를 한번에 검색
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const SearchAllSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchAllInput = z.infer<typeof SearchAllSchema>;
export declare function searchAll(apiClient: LawApiClient, input: SearchAllInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
