/**
 * Scenario: penalty — 처분·벌칙 기준 종합 조회기
 * 호스트 체인: chain_action_basis
 *
 * 추가 조회: 별표(처분기준표) + 감경/취소 행심 + 벌칙 조항 개정이력
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runPenaltyScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
