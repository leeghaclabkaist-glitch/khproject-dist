/**
 * 법령-자치법규 연계(Linkage) 도구 4종
 * - get_linked_ordinances: 법령 기준 자치법규 연계 목록
 * - get_linked_ordinance_articles: 법령-자치법규 조문 연계
 * - get_delegated_laws: 위임법령 (소관부처별)
 * - get_linked_laws_from_ordinance: 자치법규 기준 상위법령 조회
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
declare const baseLinkageSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const LinkedOrdinancesSchema: z.ZodObject<{
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
    query: z.ZodString;
}, z.core.$strip>;
export declare const LinkedOrdinanceArticlesSchema: z.ZodObject<{
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
    query: z.ZodString;
}, z.core.$strip>;
export declare const DelegatedLawsSchema: z.ZodObject<{
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
    query: z.ZodString;
}, z.core.$strip>;
export declare const LinkedLawsFromOrdinanceSchema: z.ZodObject<{
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
    query: z.ZodString;
}, z.core.$strip>;
type LinkageInput = z.infer<typeof baseLinkageSchema>;
export declare const getLinkedOrdinances: (apiClient: LawApiClient, input: LinkageInput) => Promise<import("../lib/types.js").ToolResponse | {
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
}>;
export declare const getLinkedOrdinanceArticles: (apiClient: LawApiClient, input: LinkageInput) => Promise<import("../lib/types.js").ToolResponse | {
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
}>;
export declare const getDelegatedLaws: (apiClient: LawApiClient, input: LinkageInput) => Promise<import("../lib/types.js").ToolResponse | {
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
}>;
export declare const getLinkedLawsFromOrdinance: (apiClient: LawApiClient, input: LinkageInput) => Promise<import("../lib/types.js").ToolResponse | {
    content: {
        type: string;
        text: string;
    }[];
    isError: boolean;
} | {
    content: {
        type: string;
        text: string;
    }[];
    isError?: undefined;
}>;
export {};
