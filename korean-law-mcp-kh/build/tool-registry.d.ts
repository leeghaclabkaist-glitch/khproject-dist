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
export declare function registerTools(server: Server, apiClient: LawApiClient): void;
