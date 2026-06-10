/**
 * compare_articles Tool - 조문 비교
 * 두 법령의 특정 조문을 비교합니다
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const CompareArticlesSchema: z.ZodObject<{
    law1: z.ZodObject<{
        mst: z.ZodOptional<z.ZodString>;
        lawId: z.ZodOptional<z.ZodString>;
        jo: z.ZodString;
    }, z.core.$strip>;
    law2: z.ZodObject<{
        mst: z.ZodOptional<z.ZodString>;
        lawId: z.ZodOptional<z.ZodString>;
        jo: z.ZodString;
    }, z.core.$strip>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CompareArticlesInput = z.infer<typeof CompareArticlesSchema>;
export declare function compareArticles(apiClient: LawApiClient, input: CompareArticlesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
