/**
 * search_ordinance Tool - 자치법규 검색
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const SearchOrdinanceSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchOrdinanceInput = z.infer<typeof SearchOrdinanceSchema>;
export declare function searchOrdinance(apiClient: LawApiClient, input: SearchOrdinanceInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
