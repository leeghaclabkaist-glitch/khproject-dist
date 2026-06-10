/**
 * Unified Decision Tools — 16개 도메인의 search/get을 2개 도구로 통합
 *
 * 기존 34개 도구 → search_decisions + get_decision_text
 * 컨텍스트 절감: ~51KB → ~3KB
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { LooseToolResponse } from "../lib/types.js";
export declare const SearchDecisionsSchema: z.ZodObject<{
    domain: z.ZodEnum<{
        treaty: "treaty";
        customs: "customs";
        ftc: "ftc";
        nlrc: "nlrc";
        acr: "acr";
        school: "school";
        precedent: "precedent";
        interpretation: "interpretation";
        tax_tribunal: "tax_tribunal";
        nts: "nts";
        constitutional: "constitutional";
        admin_appeal: "admin_appeal";
        pipc: "pipc";
        appeal_review: "appeal_review";
        acr_special: "acr_special";
        public_corp: "public_corp";
        public_inst: "public_inst";
        english_law: "english_law";
    }>;
    query: z.ZodOptional<z.ZodString>;
    display: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    page: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    sort: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchDecisionsInput = z.infer<typeof SearchDecisionsSchema>;
export declare function searchDecisions(apiClient: LawApiClient, input: SearchDecisionsInput): Promise<LooseToolResponse>;
export declare const GetDecisionTextSchema: z.ZodObject<{
    domain: z.ZodEnum<{
        treaty: "treaty";
        customs: "customs";
        ftc: "ftc";
        nlrc: "nlrc";
        acr: "acr";
        school: "school";
        precedent: "precedent";
        interpretation: "interpretation";
        tax_tribunal: "tax_tribunal";
        nts: "nts";
        constitutional: "constitutional";
        admin_appeal: "admin_appeal";
        pipc: "pipc";
        appeal_review: "appeal_review";
        acr_special: "acr_special";
        public_corp: "public_corp";
        public_inst: "public_inst";
        english_law: "english_law";
    }>;
    id: z.ZodString;
    full: z.ZodOptional<z.ZodBoolean>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetDecisionTextInput = z.infer<typeof GetDecisionTextSchema>;
export declare function getDecisionText(apiClient: LawApiClient, input: GetDecisionTextInput): Promise<LooseToolResponse>;
