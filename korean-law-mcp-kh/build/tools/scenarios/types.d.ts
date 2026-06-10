/**
 * Scenario 공통 타입
 * 체인 도구의 scenario 확장을 위한 인터페이스
 */
import type { LawApiClient } from "../../lib/api-client.js";
import type { LooseToolResponse } from "../../lib/types.js";
/** 시나리오 실행 결과: 추가 섹션 + 후속 액션 제안 */
export interface ScenarioResult {
    /** 추가로 표시할 섹션 배열 (▶ title + content) */
    sections: ScenarioSection[];
    /** 사용자에게 제안할 후속 쿼리 */
    suggestedActions: string[];
}
export interface ScenarioSection {
    title: string;
    content: string;
    /** true면 조회 실패 — 간략 표시 */
    isError?: boolean;
}
/** 시나리오 공통 컨텍스트 (체인에서 이미 확보한 정보 전달) */
export interface ScenarioContext {
    apiClient: LawApiClient;
    query: string;
    /** 체인이 검색한 법령 정보 */
    law?: {
        lawName: string;
        lawId: string;
        mst: string;
        lawType: string;
    };
    apiKey?: string;
    /** 시나리오별 추가 파라미터 (time_travel: fromDate/toDate, action_plan: situation 등) */
    extras?: Record<string, unknown>;
}
/** 지원하는 시나리오 목록 */
export type ScenarioType = "penalty" | "customs" | "manual" | "delegation" | "impact" | "timeline" | "time_travel" | "compliance" | "action_plan";
/** callTool 래퍼 — 체인과 동일 시그니처 */
export declare function callTool(handler: (apiClient: LawApiClient, input: any) => Promise<LooseToolResponse>, apiClient: LawApiClient, input: Record<string, unknown>): Promise<{
    text: string;
    isError: boolean;
}>;
/** ScenarioSection → 포맷팅된 문자열 */
export declare function formatSections(sections: ScenarioSection[]): string;
/** suggested_actions → 포맷팅된 문자열 */
export declare function formatSuggestedActions(actions: string[]): string;
