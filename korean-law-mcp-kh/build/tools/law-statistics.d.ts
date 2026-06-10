/**
 * get_law_statistics Tool - 법령 통계 기능
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const LawStatisticsSchema: z.ZodObject<{
    days: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type LawStatisticsInput = z.infer<typeof LawStatisticsSchema>;
export declare function getLawStatistics(apiClient: LawApiClient, input: LawStatisticsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
