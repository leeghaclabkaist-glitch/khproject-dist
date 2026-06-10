import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchTaxTribunalDecisionsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    cls: z.ZodOptional<z.ZodString>;
    gana: z.ZodOptional<z.ZodString>;
    dpaYd: z.ZodOptional<z.ZodString>;
    rslYd: z.ZodOptional<z.ZodString>;
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
export type SearchTaxTribunalDecisionsInput = z.infer<typeof searchTaxTribunalDecisionsSchema>;
export declare function searchTaxTribunalDecisions(apiClient: LawApiClient, args: SearchTaxTribunalDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getTaxTribunalDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    decisionName: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetTaxTribunalDecisionTextInput = z.infer<typeof getTaxTribunalDecisionTextSchema>;
export declare function getTaxTribunalDecisionText(apiClient: LawApiClient, args: GetTaxTribunalDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
