/**
 * Scenario: manual — 공무원 처리 매뉴얼 생성기
 * 호스트 체인: chain_procedure_detail
 *
 * 추가 조회: 법령체계(행정규칙 포함) + 자치법규 특칙 + 법령해석례
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runManualScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
