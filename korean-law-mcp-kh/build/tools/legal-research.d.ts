/**
 * legal_research — 체인 8개 통합 진입점 (v4.4.0)
 *
 * 기존 chain_* 8개를 task 파라미터 하나로 통합해 MCP 노출 도구 수와
 * ListTools 컨텍스트 비용을 줄인다. 기존 chain_* 도구는 allTools에
 * 그대로 남아 직접 호출/execute_tool 경유가 계속 동작한다 (하위호환).
 *
 * task별 허용 scenario는 체인 스키마(chains.ts)에서 직접 파생 —
 * 별도 호환표를 두지 않아 체인 쪽 enum 변경 시 자동 추종된다 (v4.4.1).
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { LooseToolResponse } from "../lib/types.js";
export declare const LegalResearchSchema: z.ZodPreprocess<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    task: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        law_system: "law_system";
        action_basis: "action_basis";
        ordinance_compare: "ordinance_compare";
        full_research: "full_research";
        dispute_prep: "dispute_prep";
        amendment_track: "amendment_track";
        procedure_detail: "procedure_detail";
        document_review: "document_review";
    }>>>;
    scenario: z.ZodOptional<z.ZodEnum<{
        customs: "customs";
        manual: "manual";
        penalty: "penalty";
        delegation: "delegation";
        impact: "impact";
        time_travel: "time_travel";
        action_plan: "action_plan";
        timeline: "timeline";
        compliance: "compliance";
    }>>;
    domain: z.ZodOptional<z.ZodEnum<{
        general: "general";
        tax: "tax";
        labor: "labor";
        privacy: "privacy";
        competition: "competition";
    }>>;
    articles: z.ZodOptional<z.ZodArray<z.ZodString>>;
    parentLaw: z.ZodOptional<z.ZodString>;
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    maxClauses: z.ZodOptional<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type LegalResearchInput = z.infer<typeof LegalResearchSchema>;
type ToolResponse = LooseToolResponse;
/**
 * 체인 스키마의 scenario 필드로 입력 scenario를 검증한다.
 * 비호환이면 버리고(자동 감지로 폴백) 경고 노트를 함께 반환 —
 * 호출 LLM이 자기 파라미터가 무시된 것을 알 수 있게 한다.
 */
export declare function pickScenario<S extends z.ZodType>(schema: S, scenario: string | undefined, task: string): {
    value: z.infer<S>;
    note?: string;
};
/** 경고 노트를 응답 첫 줄에 주입 */
export declare function withNote(note: string | undefined, res: ToolResponse): ToolResponse;
export declare function legalResearch(apiClient: LawApiClient, input: LegalResearchInput): Promise<ToolResponse>;
export {};
