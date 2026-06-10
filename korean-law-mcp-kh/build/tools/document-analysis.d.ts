/**
 * 문서 리스크 분석 도구
 *
 * 계약서/약관/협정서 텍스트를 입력받아
 * 조항별 잠재적 법적 리스크를 식별하고 관련 검색 힌트를 제공.
 * API 호출 없이 순수 텍스트 분석만 수행.
 */
import { z } from "zod";
export declare const AnalyzeDocumentSchema: z.ZodObject<{
    text: z.ZodString;
    maxClauses: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentSchema>;
export declare function analyzeDocument(_apiClient: unknown, input: AnalyzeDocumentInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
