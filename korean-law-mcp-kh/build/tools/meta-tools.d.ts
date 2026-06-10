/**
 * Meta Tools — lite 프로필에서 전체 도구 접근을 위한 디스커버리/실행 도구
 *
 * discover_tools: 의도/카테고리로 사용 가능한 도구 목록 반환
 * execute_tool:   discover로 찾은 도구를 프록시 실행
 */
import { z } from "zod";
import type { LawApiClient } from "../lib/api-client.js";
import type { McpTool, ToolResponse } from "../lib/types.js";
export declare function setAllToolsRef(tools: McpTool[]): void;
export declare const DiscoverToolsSchema: z.ZodObject<{
    intent: z.ZodString;
}, z.core.$strip>;
export declare function discoverTools(_apiClient: LawApiClient, input: z.infer<typeof DiscoverToolsSchema>): Promise<ToolResponse>;
export declare const ExecuteToolSchema: z.ZodObject<{
    tool_name: z.ZodString;
    params: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>;
export declare function executeTool(apiClient: LawApiClient, input: z.infer<typeof ExecuteToolSchema>): Promise<ToolResponse>;
