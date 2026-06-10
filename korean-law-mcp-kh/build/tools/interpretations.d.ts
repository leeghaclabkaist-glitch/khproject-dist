import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchInterpretationsSchema: z.ZodObject<{
    query: z.ZodString;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<{
        lasc: "lasc";
        ldes: "ldes";
        dasc: "dasc";
        ddes: "ddes";
        nasc: "nasc";
        ndes: "ndes";
    }>>;
    fromDate: z.ZodOptional<z.ZodString>;
    toDate: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchInterpretationsInput = z.infer<typeof searchInterpretationsSchema>;
export declare function searchInterpretations(apiClient: LawApiClient, args: SearchInterpretationsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getInterpretationTextSchema: z.ZodObject<{
    id: z.ZodString;
    caseName: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetInterpretationTextInput = z.infer<typeof getInterpretationTextSchema>;
export declare function getInterpretationText(apiClient: LawApiClient, args: GetInterpretationTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
