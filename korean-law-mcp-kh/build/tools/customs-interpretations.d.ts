import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchCustomsInterpretationsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    inq: z.ZodOptional<z.ZodNumber>;
    rpl: z.ZodOptional<z.ZodNumber>;
    gana: z.ZodOptional<z.ZodString>;
    explYd: z.ZodOptional<z.ZodString>;
    sort: z.ZodOptional<z.ZodEnum<{
        lasc: "lasc";
        ldes: "ldes";
        dasc: "dasc";
        ddes: "ddes";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchCustomsInterpretationsInput = z.infer<typeof searchCustomsInterpretationsSchema>;
export declare function searchCustomsInterpretations(apiClient: LawApiClient, args: SearchCustomsInterpretationsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
/** 국세청 법령해석 검색 (#35) — 응답 구조 관세청과 동일, target만 분기. unified-decisions만 사용 */
export declare function searchNtsInterpretations(apiClient: LawApiClient, args: SearchCustomsInterpretationsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getCustomsInterpretationTextSchema: z.ZodObject<{
    id: z.ZodString;
    interpretationName: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetCustomsInterpretationTextInput = z.infer<typeof getCustomsInterpretationTextSchema>;
export declare function getCustomsInterpretationText(apiClient: LawApiClient, args: GetCustomsInterpretationTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
/**
 * 국세청 법령해석 본문 조회 (#35)
 *
 * 법제처 OPEN API는 국세청 법령해석에 대해 **목록 조회만 제공**한다.
 * 본문 조회 endpoint(`lawService.do?target=ntsCgmExpc`)는 존재하지 않으며,
 * 검색 응답의 `법령해석상세링크`(taxlaw.nts.go.kr) 외부 페이지로만 본문 확인 가능.
 *
 * → 별도 호출 없이 외부 링크 안내 메시지 반환 (LLM 환각 방지).
 */
export declare function getNtsInterpretationText(_apiClient: LawApiClient, args: GetCustomsInterpretationTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
