/**
 * extract_precedent_keywords Tool - 판례 키워드 추출
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const ExtractKeywordsSchema: z.ZodObject<{
    id: z.ZodString;
    maxKeywords: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsSchema>;
/**
 * 법률 용어 키워드 추출 (빈도 기반)
 */
export declare function extractPrecedentKeywords(apiClient: LawApiClient, input: ExtractKeywordsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
