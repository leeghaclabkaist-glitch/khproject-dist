/**
 * get_law_tree Tool - 법령 트리 뷰
 * 법률→시행령→시행규칙 트리 구조 시각화
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetLawTreeSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLawTreeInput = z.infer<typeof GetLawTreeSchema>;
export declare function getLawTree(apiClient: LawApiClient, input: GetLawTreeInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
