import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchAiLawSchema: z.ZodObject<{
    query: z.ZodString;
    search: z.ZodDefault<z.ZodEnum<{
        0: "0";
        1: "1";
        2: "2";
        3: "3";
    }>>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    lawTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchAiLawInput = z.infer<typeof searchAiLawSchema>;
export declare function searchAiLaw(apiClient: LawApiClient, args: SearchAiLawInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchLifeLawSchema: z.ZodObject<{
    query: z.ZodString;
    search: z.ZodDefault<z.ZodEnum<{
        0: "0";
        1: "1";
        2: "2";
        3: "3";
    }>>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    lawTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchLifeLawInput = SearchAiLawInput;
export declare const searchLifeLaw: typeof searchAiLaw;
