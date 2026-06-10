import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchFtcDecisionsSchema: z.ZodObject<{
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
export type SearchFtcDecisionsInput = z.infer<typeof searchFtcDecisionsSchema>;
export declare function searchFtcDecisions(apiClient: LawApiClient, args: SearchFtcDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getFtcDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetFtcDecisionTextInput = z.infer<typeof getFtcDecisionTextSchema>;
export declare function getFtcDecisionText(apiClient: LawApiClient, args: GetFtcDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchPipcDecisionsSchema: z.ZodObject<{
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
export type SearchPipcDecisionsInput = z.infer<typeof searchPipcDecisionsSchema>;
export declare function searchPipcDecisions(apiClient: LawApiClient, args: SearchPipcDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getPipcDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetPipcDecisionTextInput = z.infer<typeof getPipcDecisionTextSchema>;
export declare function getPipcDecisionText(apiClient: LawApiClient, args: GetPipcDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchNlrcDecisionsSchema: z.ZodObject<{
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
export type SearchNlrcDecisionsInput = z.infer<typeof searchNlrcDecisionsSchema>;
export declare function searchNlrcDecisions(apiClient: LawApiClient, args: SearchNlrcDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getNlrcDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetNlrcDecisionTextInput = z.infer<typeof getNlrcDecisionTextSchema>;
export declare function getNlrcDecisionText(apiClient: LawApiClient, args: GetNlrcDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchAcrDecisionsSchema: z.ZodObject<{
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
export type SearchAcrDecisionsInput = z.infer<typeof searchAcrDecisionsSchema>;
export declare function searchAcrDecisions(apiClient: LawApiClient, args: SearchAcrDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getAcrDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetAcrDecisionTextInput = z.infer<typeof getAcrDecisionTextSchema>;
export declare function getAcrDecisionText(apiClient: LawApiClient, args: GetAcrDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
