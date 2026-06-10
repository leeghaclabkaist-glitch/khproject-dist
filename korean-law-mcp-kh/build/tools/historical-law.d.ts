import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
/**
 * 법령 연혁 조회 도구
 * - lsHistory API (HTML만 지원) 사용
 * - LexDiff의 HTML 파싱 로직 이식
 */
export interface LawHistoryEntry {
    mst: string;
    efYd: string;
    ancNo: string;
    ancYd: string;
    lawNm: string;
    rrCls: string;
}
export declare const searchHistoricalLawSchema: z.ZodObject<{
    lawName: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchHistoricalLawInput = z.infer<typeof searchHistoricalLawSchema>;
export declare function searchHistoricalLaw(apiClient: LawApiClient, args: SearchHistoricalLawInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getHistoricalLawSchema: z.ZodObject<{
    mst: z.ZodString;
    jo: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetHistoricalLawInput = z.infer<typeof getHistoricalLawSchema>;
export declare function getHistoricalLaw(apiClient: LawApiClient, args: GetHistoricalLawInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
