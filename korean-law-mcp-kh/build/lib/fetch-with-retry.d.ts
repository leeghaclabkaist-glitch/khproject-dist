/**
 * Fetch with retry and timeout
 * - Exponential backoff for 429, 503, 504
 * - AbortController for timeout
 */
/**
 * URL에서 민감 정보(API 키) 마스킹 — 에러 메시지/로그 노출 방지.
 * 법제처 API는 ?OC=KEY 쿼리 파라미터로 키를 받으므로 해당 값만 *** 처리.
 * 추가 방어로 일반적인 키 파라미터 이름들도 마스킹.
 */
export declare function maskSensitiveUrl(url: string): string;
export interface FetchWithRetryOptions extends RequestInit {
    /** Request timeout in ms (default: 30000) */
    timeout?: number;
    /** Max retry attempts (default: 3) */
    retries?: number;
    /** Base delay for exponential backoff in ms (default: 1000) */
    retryDelay?: number;
    /** HTTP status codes to retry on (default: [429, 503, 504]) */
    retryOn?: number[];
}
/**
 * Fetch with automatic retry and timeout
 */
export declare function fetchWithRetry(url: string, options?: FetchWithRetryOptions): Promise<Response>;
