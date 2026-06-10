/**
 * summarize_precedent Tool - 판례 요약 (AI 활용)
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const SummarizePrecedentSchema: z.ZodObject<{
    id: z.ZodString;
    maxLength: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SummarizePrecedentInput = z.infer<typeof SummarizePrecedentSchema>;
/**
 * 간단한 키워드 기반 요약 (AI 없이 구현)
 * 실제 AI 연동은 Claude API를 사용할 수 있지만, 여기서는 규칙 기반으로 구현
 */
export declare function summarizePrecedent(apiClient: LawApiClient, input: SummarizePrecedentInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
