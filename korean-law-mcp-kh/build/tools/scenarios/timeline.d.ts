/**
 * Scenario: timeline — 법령 시계열 종합 타임라인
 * 호스트 체인: chain_amendment_track
 *
 * 추가 조회: 개정 구간별 판례 + 해석례 + 과거 법령 조회
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runTimelineScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
