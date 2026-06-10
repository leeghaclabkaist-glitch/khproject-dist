/**
 * get_article_history Tool - 일자별 조문 개정 이력 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const ArticleHistorySchema: z.ZodObject<{
    lawId: z.ZodOptional<z.ZodString>;
    lawName: z.ZodOptional<z.ZodString>;
    jo: z.ZodOptional<z.ZodString>;
    regDt: z.ZodOptional<z.ZodString>;
    fromRegDt: z.ZodOptional<z.ZodString>;
    toRegDt: z.ZodOptional<z.ZodString>;
    org: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ArticleHistoryInput = z.infer<typeof ArticleHistorySchema>;
export declare function getArticleHistory(apiClient: LawApiClient, input: ArticleHistoryInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
