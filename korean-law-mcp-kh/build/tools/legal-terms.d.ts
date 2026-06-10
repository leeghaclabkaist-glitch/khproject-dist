import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchLegalTermsSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchLegalTermsInput = z.infer<typeof searchLegalTermsSchema>;
export declare function searchLegalTerms(apiClient: LawApiClient, args: SearchLegalTermsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
