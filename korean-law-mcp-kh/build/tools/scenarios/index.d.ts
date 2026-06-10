/**
 * Scenario 통합 실행기
 * 시나리오 타입에 따라 적절한 모듈을 호출하고 결과를 반환
 */
export type { ScenarioType, ScenarioResult, ScenarioContext } from "./types.js";
export { formatSections, formatSuggestedActions } from "./types.js";
import type { ScenarioType, ScenarioContext, ScenarioResult } from "./types.js";
/** 시나리오 실행 — 알 수 없는 타입이면 빈 결과 반환 */
export declare function runScenario(type: ScenarioType, ctx: ScenarioContext): Promise<ScenarioResult>;
/** query-router 자동감지용: 쿼리에서 시나리오 타입 추론 */
export declare function detectScenario(query: string, hostChain: string): ScenarioType | null;
