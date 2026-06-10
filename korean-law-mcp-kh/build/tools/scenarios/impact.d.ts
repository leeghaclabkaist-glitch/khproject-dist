/**
 * Scenario: impact — 법령 개정 영향도 분석
 * 호스트 체인: chain_law_system
 *
 * 추가 조회: 법체계 트리 + 연계 조례 + 연계 조문 + 행정규칙
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runImpactScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
