/**
 * 자연어 날짜 범위 파서
 * 검색 쿼리에서 시간 조건을 추출하여 YYYYMMDD 범위로 변환.
 */
export interface DateRange {
    /** 시작일 (YYYYMMDD) */
    from: string;
    /** 종료일 (YYYYMMDD) */
    to: string;
}
export interface DateParseResult {
    /** 추출된 날짜 범위 (없으면 undefined) */
    range?: DateRange;
    /** 날짜 표현을 제거한 쿼리 (검색용) */
    cleanQuery: string;
}
/** 쿼리에서 시간 조건을 추출하고, 날짜 표현을 제거한 검색어를 반환. */
export declare function parseDateRange(query: string): DateParseResult;
