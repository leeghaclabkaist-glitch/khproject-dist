/**
 * get_batch_articles Tool - 여러 조문 한번에 조회
 * 단일 법령 또는 복수 법령의 조문을 일괄 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { ToolResponse } from "../lib/types.js";
export declare const GetBatchArticlesSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    articles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    efYd: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
    laws: z.ZodOptional<z.ZodArray<z.ZodObject<{
        mst: z.ZodOptional<z.ZodString>;
        lawId: z.ZodOptional<z.ZodString>;
        articles: z.ZodArray<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type GetBatchArticlesInput = z.infer<typeof GetBatchArticlesSchema>;
export declare function getBatchArticles(apiClient: LawApiClient, input: GetBatchArticlesInput): Promise<ToolResponse>;
