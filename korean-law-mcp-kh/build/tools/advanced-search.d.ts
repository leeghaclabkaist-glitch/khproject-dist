/**
 * advanced_search Tool - 고급 검색 (기간, 부처, 복합 검색)
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const AdvancedSearchSchema: z.ZodObject<{
    query: z.ZodString;
    searchType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        law: "law";
        ordinance: "ordinance";
        admin_rule: "admin_rule";
        all: "all";
    }>>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    org: z.ZodOptional<z.ZodString>;
    operator: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        AND: "AND";
        OR: "OR";
    }>>>;
    display: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AdvancedSearchInput = z.infer<typeof AdvancedSearchSchema>;
export declare function advancedSearch(apiClient: LawApiClient, input: AdvancedSearchInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
