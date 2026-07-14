/**
 * ordinance_radar — 조례 정비 레이더 (v4.7.0 killer feature)
 *
 * 조례 본문이 「」로 인용한 근거 상위법령을 추출하고, 각 상위법의 현행 시행일과
 * 조례 시행일을 대조해 "상위법이 조례 시행 이후 개정됨 → 정비 검토 대상"을 자동 플래그.
 * 조례 담당 공무원의 최대 반복업무(상위법 개정 추적 → 조례 정비)를 한 번에 답한다.
 *
 * 데이터: 조례 본문(getOrdinance) + 법령 검색(searchLaw)만 사용.
 * lnkOrd(자치법규→상위법령 연계) API는 커버리지가 낮아 미사용 — 조례 본문의 「」
 * 인용이 한국 법령 표준 표기라 훨씬 안정적.
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const OrdinanceRadarSchema: z.ZodObject<{
    ordinSeq: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    ordinanceName: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type OrdinanceRadarInput = z.infer<typeof OrdinanceRadarSchema>;
export declare function ordinanceRadar(apiClient: LawApiClient, input: OrdinanceRadarInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
