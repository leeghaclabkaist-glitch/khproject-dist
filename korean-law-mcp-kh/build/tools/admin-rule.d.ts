/**
 * 행정규칙 관련 Tools
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const SearchAdminRuleSchema: z.ZodObject<{
    query: z.ZodString;
    knd: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchAdminRuleInput = z.infer<typeof SearchAdminRuleSchema>;
export declare function searchAdminRule(apiClient: LawApiClient, input: SearchAdminRuleInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const GetAdminRuleSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetAdminRuleInput = z.infer<typeof GetAdminRuleSchema>;
export declare function getAdminRule(apiClient: LawApiClient, input: GetAdminRuleInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const CompareAdminRuleOldNewSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CompareAdminRuleOldNewInput = z.infer<typeof CompareAdminRuleOldNewSchema>;
export declare function compareAdminRuleOldNew(apiClient: LawApiClient, input: CompareAdminRuleOldNewInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
