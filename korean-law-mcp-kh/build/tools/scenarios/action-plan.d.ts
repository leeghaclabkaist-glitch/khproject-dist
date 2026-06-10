/**
 * Scenario: action_plan — 시민 친화 step-by-step 가이드 (v4.0)
 * 호스트 체인: chain_full_research
 *
 * 처리: 시민이 처한 상황(전세금/해고/음주 등) → 5단계 실행 가이드 자동 생성
 *   STEP 1. 상황 진단 (적용 법령/조문)
 *   STEP 2. 권리 / 구제 수단
 *   STEP 3. 신청 기관 / 기한
 *   STEP 4. 필요 서류 / 양식
 *   STEP 5. 함정 / 주의 (패소·각하 사유)
 */
import type { ScenarioContext, ScenarioResult } from "./types.js";
export declare function runActionPlanScenario(ctx: ScenarioContext): Promise<ScenarioResult>;
