import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchTreatiesSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    cls: z.ZodOptional<z.ZodEnum<{
        1: "1";
        2: "2";
    }>>;
    natCd: z.ZodOptional<z.ZodString>;
    eftYd: z.ZodOptional<z.ZodString>;
    concYd: z.ZodOptional<z.ZodString>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<{
        lasc: "lasc";
        ldes: "ldes";
        dasc: "dasc";
        ddes: "ddes";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchTreatiesInput = z.infer<typeof searchTreatiesSchema>;
export declare function searchTreaties(apiClient: LawApiClient, args: SearchTreatiesInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getTreatyTextSchema: z.ZodObject<{
    id: z.ZodString;
    chrClsCd: z.ZodDefault<z.ZodEnum<{
        "010202": "010202";
        "010203": "010203";
    }>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetTreatyTextInput = z.infer<typeof getTreatyTextSchema>;
export declare function getTreatyText(apiClient: LawApiClient, args: GetTreatyTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
