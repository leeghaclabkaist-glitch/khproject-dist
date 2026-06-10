/**
 * get_three_tier Tool - 3단비교 (법률→시행령→시행규칙)
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetThreeTierSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    knd: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        1: "1";
        2: "2";
    }>>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetThreeTierInput = z.infer<typeof GetThreeTierSchema>;
export declare function getThreeTier(apiClient: LawApiClient, input: GetThreeTierInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
