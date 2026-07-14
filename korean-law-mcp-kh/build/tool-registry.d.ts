/**
 * MCP 도구 레지스트리
 * 모든 도구 등록 및 핸들러 관리
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { LawApiClient } from "./lib/api-client.js";
import type { McpTool } from "./lib/types.js";
/**
 * 모든 MCP 도구 정의
 */
export declare const allTools: McpTool[];
/** 노출/전체 도구 수 — 헬스체크 등 표기용 파생값 (하드코딩 금지) */
export declare const TOOL_COUNTS: {
    exposed: number;
    total: number;
};
export declare function registerTools(server: Server, apiClient: LawApiClient): void;
