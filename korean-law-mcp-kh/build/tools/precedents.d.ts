import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchPrecedentsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    court: z.ZodOptional<z.ZodString>;
    caseNumber: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<{
        lasc: "lasc";
        ldes: "ldes";
        dasc: "dasc";
        ddes: "ddes";
        nasc: "nasc";
        ndes: "ndes";
    }>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchPrecedentsInput = z.infer<typeof searchPrecedentsSchema>;
export declare function searchPrecedents(apiClient: LawApiClient, args: SearchPrecedentsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getPrecedentTextSchema: z.ZodObject<{
    id: z.ZodString;
    caseName: z.ZodOptional<z.ZodString>;
    full: z.ZodOptional<z.ZodBoolean>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetPrecedentTextInput = z.infer<typeof getPrecedentTextSchema>;
export declare function getPrecedentText(apiClient: LawApiClient, args: GetPrecedentTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
