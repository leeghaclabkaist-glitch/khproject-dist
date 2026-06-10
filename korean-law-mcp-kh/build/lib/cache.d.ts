/**
 * Simple in-memory cache for law data
 * 자주 조회되는 법령 데이터를 캐싱하여 API 호출 절약
 */
export declare class SimpleCache {
    private cache;
    private maxSize;
    constructor(maxSize?: number);
    set<T>(key: string, data: T, ttl?: number): void;
    /** 만료 엔트리 우선 제거, 없으면 LRU(가장 오래된) 제거 */
    private evictOne;
    get<T>(key: string): T | null;
    has(key: string): boolean;
    delete(key: string): void;
    clear(): void;
    size(): number;
    cleanup(): void;
}
export declare const lawCache: SimpleCache;
