/**
 * CLI 출력 포맷팅 유틸리티
 * 색상, 배너, 도구 목록, 스키마 추출 등
 */
import { z } from "zod";
import type { McpTool } from "./types.js";
export declare const isColorSupported: boolean;
/**
 * ANSI 포맷 유틸.
 * 중첩 시 내부 \x1b[0m이 외부까지 리셋하는 문제 방지:
 * 단일 래퍼만 사용하거나, 복합 스타일은 전용 함수로 처리.
 */
export declare const fmt: {
    bold: (s: string) => string;
    dim: (s: string) => string;
    green: (s: string) => string;
    yellow: (s: string) => string;
    cyan: (s: string) => string;
    red: (s: string) => string;
    blue: (s: string) => string;
    magenta: (s: string) => string;
    boldCyan: (s: string) => string;
    boldGreen: (s: string) => string;
};
export declare function printBanner(): void;
export declare function printRouteInfo(tool: string, reason: string): void;
export declare function formatOutput(text: string): string;
export declare function printInteractiveHelp(): void;
export declare function getCategory(tool: McpTool): string;
export declare function printToolList(): void;
export interface CliOption {
    name: string;
    description: string;
    required: boolean;
    type: string;
    defaultValue?: unknown;
}
export declare function extractOptionsFromSchema(schema: z.ZodSchema): CliOption[];
export declare function coerceValue(value: string, type: string): unknown;
