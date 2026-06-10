import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchEnglishLawSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<{
        lasc: "lasc";
        ldes: "ldes";
        dasc: "dasc";
        ddes: "ddes";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchEnglishLawInput = z.infer<typeof searchEnglishLawSchema>;
export declare function searchEnglishLaw(apiClient: LawApiClient, args: SearchEnglishLawInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getEnglishLawTextSchema: z.ZodObject<{
    lawId: z.ZodOptional<z.ZodString>;
    mst: z.ZodOptional<z.ZodString>;
    lawName: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetEnglishLawTextInput = z.infer<typeof getEnglishLawTextSchema>;
export declare function getEnglishLawText(apiClient: LawApiClient, args: GetEnglishLawTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
