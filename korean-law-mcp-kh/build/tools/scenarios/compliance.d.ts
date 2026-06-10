/**
 * Scenario: compliance — 조례 상위법 적합성 검증기
 * 호스트 체인: chain_ordinance_compare
 *
 * 추가 조회: 상위법 위임근거 + 헌재 위헌 판결 + 권익위 심판례
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runComplianceScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
