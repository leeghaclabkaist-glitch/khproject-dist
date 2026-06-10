/**
 * compare_old_new Tool - 신구법 대조
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const CompareOldNewSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    ld: z.ZodOptional<z.ZodString>;
    ln: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CompareOldNewInput = z.infer<typeof CompareOldNewSchema>;
export declare function compareOldNew(apiClient: LawApiClient, input: CompareOldNewInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
