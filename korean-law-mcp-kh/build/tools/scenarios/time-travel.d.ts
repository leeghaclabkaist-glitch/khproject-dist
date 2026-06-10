/**
 * Scenario: time_travel — 두 시점 법령 본문 자동 diff (v4.0)
 * 호스트 체인: chain_amendment_track
 *
 * 입력 (extras): fromDate (YYYYMMDD), toDate (YYYYMMDD)
 * 처리:
 *   1. 법령의 연혁(searchHistoricalLaw)에서 두 시점에 해당하는 MST 결정
 *      - "해당 시점에 시행 중이었던 버전" = efYd <= 시점 중 가장 큰 efYd
 *   2. 두 MST의 본문을 raw API로 직접 가져와 조문 단위 비교
 *   3. 추가(+) / 삭제(-) / 변경(△) 조문 분류 출력
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runTimeTravelScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
