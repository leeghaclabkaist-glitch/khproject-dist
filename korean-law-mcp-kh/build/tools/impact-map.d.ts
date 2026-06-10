/**
 * impact_map — 조문 한 줄의 파급효과 그래프 (v4.0 killer feature)
 *
 * 입력: lawName + jo (조문번호)
 * 처리:
 *   1. 해당 조문 본문 조회 (참조 추출용)
 *   2. 병렬 역방향 탐색:
 *      - 그 조문을 인용한 판례 (대법원)
 *      - 그 조문을 인용한 해석례 (법령해석)
 *      - 그 조문을 인용한 행정심판례
 *      - 그 법령을 인용한 자치법규 (조례·규칙)
 *      - 그 조문이 인용한 다른 법령 (정방향)
 *   3. 텍스트 트리 + mermaid 그래프 출력
 *
 * 차별점: 다른 모든 chain은 query 기반 단방향. 이 도구는 "특정 조문 → 영향받는 모든 곳" 역방향 그래프.
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const ImpactMapSchema: z.ZodObject<{
    lawName: z.ZodString;
    jo: z.ZodString;
    includeOrdinances: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includeMermaid: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ImpactMapInput = z.infer<typeof ImpactMapSchema>;
export declare function impactMap(apiClient: LawApiClient, input: ImpactMapInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
