/**
 * get_ordinance Tool - 자치법규 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetOrdinanceSchema: z.ZodObject<{
    ordinSeq: z.ZodString;
    jo: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetOrdinanceInput = z.infer<typeof GetOrdinanceSchema>;
export declare function getOrdinance(apiClient: LawApiClient, input: GetOrdinanceInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
