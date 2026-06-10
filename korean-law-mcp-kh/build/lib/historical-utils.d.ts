/**
 * 연혁 조회 유틸 — time_travel 시나리오에서 raw 데이터 필요
 * (tools/historical-law.ts는 포맷팅된 텍스트만 반환하므로 별도 추출)
 */
import type { LawApiClient } from "./api-client.js";
export interface HistoricalVersion {
    mst: string;
    efYd: string;
    ancNo: string;
    ancYd: string;
    lawNm: string;
    rrCls: string;
}
export interface HistoricalFetchResult {
    versions: HistoricalVersion[];
    totalCount: number;
    fetchedPages: number;
}
/**
 * lsHistory API 호출 → HTML 파싱 → 시행일 내림차순
 * 자주 개정되는 법령(소득세법 시행령 등 200+ 건)도 페이징으로 전체 회수.
 */
export declare function fetchHistoricalVersionsFull(apiClient: LawApiClient, lawName: string, apiKey?: string, pageSize?: number): Promise<HistoricalFetchResult>;
/** @deprecated Use fetchHistoricalVersionsFull. 단일 페이지(legacy 호환용). */
export declare function fetchHistoricalVersionsRaw(apiClient: LawApiClient, lawName: string, apiKey?: string, display?: number): Promise<HistoricalVersion[]>;
