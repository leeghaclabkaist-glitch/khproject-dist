import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchSchoolRulesSchema: z.ZodObject<{
    query: z.ZodString;
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
export type SearchSchoolRulesInput = z.infer<typeof searchSchoolRulesSchema>;
export declare function searchSchoolRules(apiClient: LawApiClient, args: SearchSchoolRulesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getSchoolRuleTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetSchoolRuleTextInput = z.infer<typeof getSchoolRuleTextSchema>;
export declare function getSchoolRuleText(apiClient: LawApiClient, args: GetSchoolRuleTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchPublicCorpRulesSchema: z.ZodObject<{
    query: z.ZodString;
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
export type SearchPublicCorpRulesInput = z.infer<typeof searchPublicCorpRulesSchema>;
export declare function searchPublicCorpRules(apiClient: LawApiClient, args: SearchPublicCorpRulesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getPublicCorpRuleTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetPublicCorpRuleTextInput = z.infer<typeof getPublicCorpRuleTextSchema>;
export declare function getPublicCorpRuleText(apiClient: LawApiClient, args: GetPublicCorpRuleTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchPublicInstitutionRulesSchema: z.ZodObject<{
    query: z.ZodString;
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
export type SearchPublicInstitutionRulesInput = z.infer<typeof searchPublicInstitutionRulesSchema>;
export declare function searchPublicInstitutionRules(apiClient: LawApiClient, args: SearchPublicInstitutionRulesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getPublicInstitutionRuleTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetPublicInstitutionRuleTextInput = z.infer<typeof getPublicInstitutionRuleTextSchema>;
export declare function getPublicInstitutionRuleText(apiClient: LawApiClient, args: GetPublicInstitutionRuleTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
