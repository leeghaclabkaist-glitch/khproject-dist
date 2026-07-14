import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { ToolResponse } from "../lib/types.js";
export declare const searchAiLawSchema: z.ZodObject<{
    query: z.ZodString;
    search: z.ZodDefault<z.ZodEnum<{
        0: "0";
        1: "1";
        2: "2";
        3: "3";
    }>>;
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
    lawTypes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    apiKey: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SearchAiLawInput = z.infer<typeof searchAiLawSchema>;
type AiLawSearchType = SearchAiLawInput["search"];
interface AiLawParsedItem {
    시행일자: string;
    법령ID?: string;
    법령명?: string;
    법령종류명?: string;
    소관부처명?: string;
    조문번호?: string;
    조문가지번호?: string;
    조문제목?: string;
    조문내용?: string;
    행정규칙ID?: string;
    행정규칙명?: string;
    발령기관명?: string;
    별표서식번호?: string;
    별표서식제목?: string;
    별표서식구분명?: string;
}
export interface AiLawArticleSignal {
    lawName: string;
    articleNo: string;
    articleBranchNo?: string;
    articleTitle: string;
    articleContent: string;
    effectiveDate: string;
    sourceIndex: number;
}
export interface ParsedAiLawSearch {
    totalCount: number;
    items: AiLawParsedItem[];
    articleSignals: AiLawArticleSignal[];
}
export interface SearchAiLawStructuredResult {
    response: ToolResponse;
    articleSignals: AiLawArticleSignal[];
}
export declare function parseAiLawSearchXml(xmlText: string, searchType?: AiLawSearchType): ParsedAiLawSearch;
export declare function searchAiLawStructured(apiClient: LawApiClient, args: SearchAiLawInput): Promise<SearchAiLawStructuredResult>;
export declare function searchAiLaw(apiClient: LawApiClient, args: SearchAiLawInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
export {};
