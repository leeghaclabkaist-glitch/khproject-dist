/**
 * Scenario: customs — 관세·통관 종합 법률 체크
 * 호스트 체인: chain_full_research
 *
 * 추가 조회: 관세3법 체계 + 관세청 해석례 + FTA 조약 + 세율 별표 + 조세심판
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runCustomsScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
