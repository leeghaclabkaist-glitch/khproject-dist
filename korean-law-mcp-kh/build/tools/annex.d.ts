/**
 * get_annexes Tool - 별표/서식 조회 + 텍스트 추출
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const GetAnnexesSchema: z.ZodObject<{
    lawName: z.ZodString;
    knd: z.ZodOptional<z.ZodEnum<{
        1: "1";
        2: "2";
        3: "3";
        4: "4";
        5: "5";
    }>>;
    bylSeq: z.ZodOptional<z.ZodString>;
    annexNo: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetAnnexesInput = z.infer<typeof GetAnnexesSchema>;
export declare function getAnnexes(apiClient: LawApiClient, input: GetAnnexesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
