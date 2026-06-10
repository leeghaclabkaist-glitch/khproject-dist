/**
 * Streamable HTTP 서버 - stateless 모드 (MCP 공식 패턴)
 *
 * 매 POST 요청마다 fresh Server + Transport 생성, 요청 종료 시 즉시 정리.
 * 세션 Map/EventStore/idle cleanup 없음 → 재시작/스케일아웃/OOM 내성.
 * 참고: @modelcontextprotocol/sdk/examples/server/simpleStatelessStreamableHttp.js
 */
import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
export declare function startHTTPServer(createServer: () => Server, port: number): Promise<void>;
