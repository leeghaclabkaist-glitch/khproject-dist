/**
 * applicable_law — 행위시법 판단 (v4.3 killer feature)
 *
 * 문제: "사건 발생 시점(예: 2023.5.10)에 어떤 법이 적용되나"는 법률 실무 최빈 질문인데,
 *       LLM은 항상 현행법으로 답해서 오답을 낸다. 결론은 부칙 경과조치가 뒤집을 수 있다.
 *
 * 입력: 법령명 + 기준일(행위·계약·처분 시점) + 조문(선택)
 * 처리:
 *   1. lsHistory 연혁으로 기준일에 시행 중이던 버전(MST) 특정
 *   2. 그 버전의 해당 조문 본문 조회 (eflaw는 MST가 버전 고유)
 *   3. 현행 조문과 동일/변경 비교
 *   4. 이후 개정 부칙에서 적용례·경과조치 자동 발췌 (공포번호 매칭)
 *   5. 행위시법/재판시법/제재처분 법리 주의 문구
 *
 * 차별점: time_travel은 두 시점 diff. 이 도구는 "특정 시점의 적용 법령 버전 특정 + 경과규정".
 * 한계: 경과조치 '해석'은 하지 않음 — 발췌와 경고까지만 (해석은 사람/LLM 몫).
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { ToolResponse } from "../lib/types.js";
export declare const ApplicableLawSchema: z.ZodObject<{
    lawName: z.ZodString;
    date: z.ZodString;
    jo: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ApplicableLawInput = z.infer<typeof ApplicableLawSchema>;
/** 다양한 날짜 표기 → YYYYMMDD. 실패 시 null */
export declare function normalizeDate(input: string): string | null;
export declare function applicableLaw(apiClient: LawApiClient, input: ApplicableLawInput): Promise<ToolResponse>;
