/**
 * get_law_history Tool - 법령 변경이력 목록 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const LawHistorySchema: z.ZodObject<{
    regDt: z.ZodString;
    org: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type LawHistoryInput = z.infer<typeof LawHistorySchema>;
export declare function getLawHistory(apiClient: LawApiClient, input: LawHistoryInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
