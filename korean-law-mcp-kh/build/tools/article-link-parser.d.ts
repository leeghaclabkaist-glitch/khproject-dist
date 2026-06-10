/**
 * parse_article_links Tool - 조문 내 참조 링크 파싱
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
export declare const ParseArticleLinksSchema: z.ZodObject<{
    mst: z.ZodOptional<z.ZodString>;
    lawId: z.ZodOptional<z.ZodString>;
    jo: z.ZodString;
    efYd: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ParseArticleLinksInput = z.infer<typeof ParseArticleLinksSchema>;
export declare function parseArticleLinks(apiClient: LawApiClient, input: ParseArticleLinksInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
