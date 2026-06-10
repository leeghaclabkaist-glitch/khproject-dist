/**
 * verify_citations — LLM 환각 방지 인용 검증 도구
 *
 * 입력 텍스트에서 "법령명 제N조(의M)? 제K항? 제L호?" 형태 인용을 추출하고,
 * 각 인용의 실존을 법제처 API로 교차검증.
 *
 * 구현 방침:
 *   - 법령 검색: lib/law-search.ts의 findLaws (관련도 정렬 + 캐시 재사용)
 *   - 조문 데이터: api-client.getLawText (JSON 원본 필요)
 *   - 항 번호 파싱: article-parser.parseHangNumber (원숫자 ①②③ 처리)
 *
 * 결과:
 *   ✓ 법령·조문 실존 (가능하면 조문 제목 포함)
 *   ✗ 법령 없음 / 조문 없음 (존재 범위 힌트)
 *   ⚠ 법령명 불명확 / 부분 매칭 / API 실패
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const VerifyCitationsSchema: z.ZodObject<{
    text: z.ZodString;
    maxCitations: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type VerifyCitationsInput = z.infer<typeof VerifyCitationsSchema>;
export declare function verifyCitations(apiClient: LawApiClient, input: VerifyCitationsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
