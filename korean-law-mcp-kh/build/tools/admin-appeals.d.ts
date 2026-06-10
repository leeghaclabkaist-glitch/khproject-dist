import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const searchAdminAppealsSchema: z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
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
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchAdminAppealsInput = z.infer<typeof searchAdminAppealsSchema>;
export declare function searchAdminAppeals(apiClient: LawApiClient, args: SearchAdminAppealsInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export declare const getAdminAppealTextSchema: z.ZodObject<{
    id: z.ZodString;
    caseName: z.ZodOptional<z.ZodString>;
    full: z.ZodOptional<z.ZodBoolean>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetAdminAppealTextInput = z.infer<typeof getAdminAppealTextSchema>;
export declare function getAdminAppealText(apiClient: LawApiClient, args: GetAdminAppealTextInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
