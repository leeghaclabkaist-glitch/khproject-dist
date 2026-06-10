import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchAppealReviewDecisionsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
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
export type SearchAppealReviewDecisionsInput = z.infer<typeof searchAppealReviewDecisionsSchema>;
export declare function searchAppealReviewDecisions(apiClient: LawApiClient, args: SearchAppealReviewDecisionsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getAppealReviewDecisionTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetAppealReviewDecisionTextInput = z.infer<typeof getAppealReviewDecisionTextSchema>;
export declare function getAppealReviewDecisionText(apiClient: LawApiClient, args: GetAppealReviewDecisionTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const searchAcrSpecialAppealsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
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
export type SearchAcrSpecialAppealsInput = z.infer<typeof searchAcrSpecialAppealsSchema>;
export declare function searchAcrSpecialAppeals(apiClient: LawApiClient, args: SearchAcrSpecialAppealsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getAcrSpecialAppealTextSchema: z.ZodObject<{
    id: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetAcrSpecialAppealTextInput = z.infer<typeof getAcrSpecialAppealTextSchema>;
export declare function getAcrSpecialAppealText(apiClient: LawApiClient, args: GetAcrSpecialAppealTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
