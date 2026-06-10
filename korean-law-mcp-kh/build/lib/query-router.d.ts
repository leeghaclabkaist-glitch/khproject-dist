/**
 * Smart Query Router
 * 자연어 질의를 분석하여 최적의 도구/체인으로 라우팅
 *
 * 패턴 매칭 기반으로 의도를 파악하고, 필요한 파라미터를 자동 추출
 */
import { type DateRange } from "./date-parser.js";
export interface RouteResult {
    /** 실행할 도구 이름 */
    tool: string;
    /** 도구에 전달할 파라미터 */
    params: Record<string, unknown>;
    /** 라우팅 근거 설명 */
    reason: string;
    /** 후속 실행이 필요한 도구 (파이프라인) */
    pipeline?: Array<{
        tool: string;
        params: Record<string, unknown>;
    }>;
    /** 자동 체인 여부 (search → detail 자동 연결) */
    autoChain?: boolean;
    /** 자연어에서 추출된 날짜 범위 (검색 도구에 자동 적용) */
    dateRange?: DateRange;
}
/**
 * 자연어 질의를 분석하여 최적의 도구로 라우팅
 */
export declare function routeQuery(query: string): RouteResult;
/**
 * 쿼리 의도 분석 결과 (디버깅/로깅용)
 */
export declare function explainRoute(query: string): string;
