/**
 * cite_check — 판례 생사 확인 / 인용 추적 (v4.3 killer feature, 한국형 Shepard's Citator)
 *
 * 문제: 전원합의체로 변경·폐기된 판례를 살아있는 것처럼 인용하는 것이
 *       판례 인용에서 가장 위험한 실수. LLM도 사람도 자주 범한다.
 *
 * 입력: 사건번호 (예: '2013다61381')
 * 처리:
 *   1. nb= 정확 검색으로 대상 판례 특정
 *   2. 본문검색(search=2)으로 그 사건번호를 인용한 후속 판례 역추적
 *   3. 후속 판례 중 전원합의체 우선 본문 정밀 스캔 → 변경·폐기 문구 감지
 *   4. 판정: 계속 인용 / 전합 후속 존재 / 변경 신호 감지 + 인용 타임라인
 *
 * 차별점: impact_map은 조문→판례 방향만 다룸. 판례→판례 인용 관계는 이 도구가 유일.
 * 한계: 법제처 수록 판례(대법원 중심) 범위 내 — 출력에 명시하여 과신 방지.
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { ToolResponse } from "../lib/types.js";
export declare const CiteCheckSchema: z.ZodObject<{
    caseNumber: z.ZodString;
    display: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    deepScan: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CiteCheckInput = z.infer<typeof CiteCheckSchema>;
export declare function extractCaseNumbers(text: string): string[];
export declare function citeCheck(apiClient: LawApiClient, input: CiteCheckInput): Promise<ToolResponse>;
