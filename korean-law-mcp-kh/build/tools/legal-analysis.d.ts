/**
 * legal_analysis — 정밀 분석/검증 4종 통합 진입점 (v4.4.0)
 *
 * verify_citations·cite_check·applicable_law·impact_map을 mode 파라미터로
 * 통합해 MCP 노출 도구 수를 줄인다. 원본 도구는 allTools에 그대로 남아
 * 직접 호출/execute_tool 경유가 계속 동작한다 (하위호환).
 * 비용이 큰 옵션(deepScan, includeOrdinances, includeMermaid 등)은
 * 패스스루로 노출 — 기본값은 원본 도구와 동일 (v4.4.1).
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { LooseToolResponse } from "../lib/types.js";
export declare const LegalAnalysisSchema: z.ZodObject<{
    mode: z.ZodEnum<{
        verify_citations: "verify_citations";
        cite_check: "cite_check";
        applicable_law: "applicable_law";
        impact_map: "impact_map";
    }>;
    text: z.ZodOptional<z.ZodString>;
    caseNumber: z.ZodOptional<z.ZodString>;
    lawName: z.ZodOptional<z.ZodString>;
    jo: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    maxCitations: z.ZodOptional<z.ZodNumber>;
    display: z.ZodOptional<z.ZodNumber>;
    deepScan: z.ZodOptional<z.ZodBoolean>;
    includeOrdinances: z.ZodOptional<z.ZodBoolean>;
    includeMermaid: z.ZodOptional<z.ZodBoolean>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type LegalAnalysisInput = z.infer<typeof LegalAnalysisSchema>;
type ToolResponse = LooseToolResponse;
export declare function legalAnalysis(apiClient: LawApiClient, input: LegalAnalysisInput): Promise<ToolResponse>;
export {};
