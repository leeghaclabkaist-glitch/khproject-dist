/**
 * get_external_links Tool - 외부 링크 생성 (법제처, 법원도서관 등)
 */
import { z } from "zod";
export declare const ExternalLinksSchema: z.ZodObject<{
    linkType: z.ZodEnum<{
        law: "law";
        ordinance: "ordinance";
        precedent: "precedent";
        interpretation: "interpretation";
        admin_rule: "admin_rule";
    }>;
    lawId: z.ZodOptional<z.ZodString>;
    mst: z.ZodOptional<z.ZodString>;
    lawName: z.ZodOptional<z.ZodString>;
    jo: z.ZodOptional<z.ZodString>;
    precedentId: z.ZodOptional<z.ZodString>;
    interpretationId: z.ZodOptional<z.ZodString>;
    adminRuleId: z.ZodOptional<z.ZodString>;
    ordinanceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ExternalLinksInput = z.infer<typeof ExternalLinksSchema>;
export declare function getExternalLinks(input: ExternalLinksInput): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}>;
