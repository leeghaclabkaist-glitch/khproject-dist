/**
 * parse_jo_code Tool - JO 코드 양방향 변환
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const ParseJoCodeSchema: z.ZodObject<{
    joText: z.ZodString;
    direction: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        to_code: "to_code";
        to_text: "to_text";
    }>>>;
    lawType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        law: "law";
        ordinance: "ordinance";
    }>>>;
}, z.core.$strip>;
export type ParseJoCodeInput = z.infer<typeof ParseJoCodeSchema>;
export declare function parseJoCode(input: ParseJoCodeInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const GetLawAbbreviationsSchema: z.ZodObject<{
    stdDt: z.ZodOptional<z.ZodString>;
    endDt: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLawAbbreviationsInput = z.infer<typeof GetLawAbbreviationsSchema>;
export declare function getLawAbbreviations(apiClient: LawApiClient, input: GetLawAbbreviationsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
