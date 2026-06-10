/**
 * get_law_text Tool - 법령 조문 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetLawTextSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    jo: z.ZodOptional<z.ZodString>;
    efYd: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLawTextInput = z.infer<typeof GetLawTextSchema>;
export declare function getLawText(apiClient: LawApiClient, input: GetLawTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
