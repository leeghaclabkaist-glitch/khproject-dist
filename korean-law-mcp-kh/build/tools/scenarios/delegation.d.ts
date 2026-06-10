/**
 * Scenario: delegation — 위임입법 미이행 감시기
 * 호스트 체인: chain_law_system
 *
 * 추가 조회: 위임법령(미제정) + 법체계(행정규칙 포함) + 조문 이력
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runDelegationScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
