/**
 * find_similar_precedents Tool - 유사 판례 검색
 * 키워드 기반 유사도 계산 (간단한 구현)
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const FindSimilarPrecedentsSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FindSimilarPrecedentsInput = z.infer<typeof FindSimilarPrecedentsSchema>;
/**
 * 유사 판례 검색 (키워드 기반)
 * 실제 벡터 유사도 계산은 향후 추가 가능
 */
export declare function findSimilarPrecedents(apiClient: LawApiClient, input: FindSimilarPrecedentsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
