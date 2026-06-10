/**
 * get_article_detail Tool - 조항호목 단위 정밀 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetArticleDetailSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    jo: z.ZodString;
    hang: z.ZodOptional<z.ZodString>;
    ho: z.ZodOptional<z.ZodString>;
    mok: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetArticleDetailInput = z.infer<typeof GetArticleDetailSchema>;
export declare function getArticleDetail(apiClient: LawApiClient, input: GetArticleDetailInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
