/**
 * get_article_with_precedents Tool - 조문 조회 + 관련 판례 자동 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetArticleWithPrecedentsSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    jo: z.ZodString;
    efYd: z.ZodOptional<z.ZodString>;
    includePrecedents: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetArticleWithPrecedentsInput = z.infer<typeof GetArticleWithPrecedentsSchema>;
export declare function getArticleWithPrecedents(apiClient: LawApiClient, input: GetArticleWithPrecedentsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
