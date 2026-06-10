import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchConstitutionalDecisionsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
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
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchConstitutionalDecisionsInput = z.infer<typeof searchConstitutionalDecisionsSchema>;
export declare function searchConstitutionalDecisions(apiClient: LawApiClient, args: SearchConstitutionalDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getConstitutionalDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    caseName: z.ZodOptional<z.ZodString>;
    full: z.ZodOptional<z.ZodBoolean>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetConstitutionalDecisionTextInput = z.infer<typeof getConstitutionalDecisionTextSchema>;
export declare function getConstitutionalDecisionText(apiClient: LawApiClient, args: GetConstitutionalDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
