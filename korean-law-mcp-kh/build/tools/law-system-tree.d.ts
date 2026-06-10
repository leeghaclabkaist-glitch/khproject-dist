import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const getLawSystemTreeSchema: z.ZodObject<{
    lawId: z.ZodOptional<z.ZodString>;
    mst: z.ZodOptional<z.ZodString>;
    lawName: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type GetLawSystemTreeInput = z.infer<typeof getLawSystemTreeSchema>;
export declare function getLawSystemTree(apiClient: LawApiClient, args: GetLawSystemTreeInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
