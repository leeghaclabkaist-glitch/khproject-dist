/**
 * Chain Tools -- 질문 유형별 다단계 자동 체이닝
 * 7개 체인 + 키워드 트리거 확장
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { ToolResponse } from "../lib/types.js";
export declare const chainLawSystemSchema: z.ZodObject<{
    query: z.ZodString;
    articles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    scenario: z.ZodOptional<z.ZodEnum<{
        delegation: "delegation";
        impact: "impact";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainLawSystem(apiClient: LawApiClient, input: z.infer<typeof chainLawSystemSchema>): Promise<ToolResponse>;
export declare const chainActionBasisSchema: z.ZodObject<{
    query: z.ZodString;
    scenario: z.ZodOptional<z.ZodEnum<{
        penalty: "penalty";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainActionBasis(apiClient: LawApiClient, input: z.infer<typeof chainActionBasisSchema>): Promise<ToolResponse>;
export declare const chainDisputePrepSchema: z.ZodObject<{
    query: z.ZodString;
    domain: z.ZodOptional<z.ZodEnum<{
        general: "general";
        tax: "tax";
        labor: "labor";
        privacy: "privacy";
        competition: "competition";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainDisputePrep(apiClient: LawApiClient, input: z.infer<typeof chainDisputePrepSchema>): Promise<ToolResponse>;
export declare const chainAmendmentTrackSchema: z.ZodObject<{
    query: z.ZodString;
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    scenario: z.ZodOptional<z.ZodEnum<{
        timeline: "timeline";
        time_travel: "time_travel";
    }>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainAmendmentTrack(apiClient: LawApiClient, input: z.infer<typeof chainAmendmentTrackSchema>): Promise<ToolResponse>;
export declare const chainOrdinanceCompareSchema: z.ZodObject<{
    query: z.ZodString;
    parentLaw: z.ZodOptional<z.ZodString>;
    scenario: z.ZodOptional<z.ZodEnum<{
        compliance: "compliance";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainOrdinanceCompare(apiClient: LawApiClient, input: z.infer<typeof chainOrdinanceCompareSchema>): Promise<ToolResponse>;
export declare const chainFullResearchSchema: z.ZodObject<{
    query: z.ZodString;
    scenario: z.ZodOptional<z.ZodEnum<{
        customs: "customs";
        action_plan: "action_plan";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainFullResearch(apiClient: LawApiClient, input: z.infer<typeof chainFullResearchSchema>): Promise<ToolResponse>;
export declare const chainProcedureDetailSchema: z.ZodObject<{
    query: z.ZodString;
    scenario: z.ZodOptional<z.ZodEnum<{
        manual: "manual";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainProcedureDetail(apiClient: LawApiClient, input: z.infer<typeof chainProcedureDetailSchema>): Promise<ToolResponse>;
export declare const chainDocumentReviewSchema: z.ZodObject<{
    text: z.ZodString;
    maxClauses: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare function chainDocumentReview(apiClient: LawApiClient, input: z.infer<typeof chainDocumentReviewSchema>): Promise<ToolResponse>;
