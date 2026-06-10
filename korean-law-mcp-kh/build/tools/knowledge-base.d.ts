import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const getLegalTermKBSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLegalTermKBInput = z.infer<typeof getLegalTermKBSchema>;
export declare function getLegalTermKB(apiClient: LawApiClient, args: GetLegalTermKBInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getLegalTermDetailSchema: z.ZodObject<{
    query: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLegalTermDetailInput = z.infer<typeof getLegalTermDetailSchema>;
export declare function getLegalTermDetail(apiClient: LawApiClient, args: GetLegalTermDetailInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getDailyTermSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetDailyTermInput = z.infer<typeof getDailyTermSchema>;
export declare function getDailyTerm(apiClient: LawApiClient, args: GetDailyTermInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getDailyToLegalSchema: z.ZodObject<{
    dailyTerm: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetDailyToLegalInput = z.infer<typeof getDailyToLegalSchema>;
export declare function getDailyToLegal(apiClient: LawApiClient, args: GetDailyToLegalInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getLegalToDailySchema: z.ZodObject<{
    legalTerm: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLegalToDailyInput = z.infer<typeof getLegalToDailySchema>;
export declare function getLegalToDaily(apiClient: LawApiClient, args: GetLegalToDailyInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getTermArticlesSchema: z.ZodObject<{
    term: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetTermArticlesInput = z.infer<typeof getTermArticlesSchema>;
export declare function getTermArticles(apiClient: LawApiClient, args: GetTermArticlesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getRelatedLawsSchema: z.ZodObject<{
    lawId: z.ZodOptional<z.ZodString>;
    lawName: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetRelatedLawsInput = z.infer<typeof getRelatedLawsSchema>;
export declare function getRelatedLaws(apiClient: LawApiClient, args: GetRelatedLawsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
