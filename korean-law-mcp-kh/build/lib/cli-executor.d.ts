/**
 * CLI 쿼리 실행 엔진
 * 도구 호출, 자연어 라우팅 실행, 파이프라인 처리
 */
import { LawApiClient } from "./api-client.js";
import type { ToolResponse } from "./types.js";
export declare function getApiClient(): LawApiClient;
export declare function executeTool(apiClient: LawApiClient, toolName: string, params: Record<string, unknown>): Promise<ToolResponse>;
/**
 * 자연어 쿼리 실행 (라우팅 + 파이프라인)
 */
export declare function executeNaturalQuery(apiClient: LawApiClient, query: string, verbose: boolean): Promise<void>;
/**
 * 자연어 쿼리 JSON 출력 (top-level --json 플래그)
 */
export declare function executeNaturalQueryJson(apiClient: LawApiClient, query: string): Promise<void>;
