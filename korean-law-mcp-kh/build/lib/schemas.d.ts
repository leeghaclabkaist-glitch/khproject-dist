/**
 * 공통 Zod 스키마
 */
import { z } from "zod";
/**
 * 날짜 스키마 (YYYYMMDD 형식)
 */
export declare const dateSchema: z.ZodString;
/**
 * 선택적 날짜 스키마
 */
export declare const optionalDateSchema: z.ZodOptional<z.ZodString>;
/**
 * 페이지네이션 스키마
 */
export declare const paginationSchema: z.ZodObject<{
    display: z.ZodDefault<z.ZodNumber>;
    page: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * 응답 크기 제한 (50KB)
 */
export declare const MAX_RESPONSE_SIZE = 50000;
/**
 * 날짜 포맷 (YYYYMMDD → YYYY.MM.DD)
 */
export declare function formatDateDot(dateStr: string): string;
/**
 * truncateResponse 옵션
 */
interface TruncateOptions {
    maxLength?: number;
    /** true이면 초과 시 핵심 내용만 요약 추출 */
    summary?: boolean;
}
/**
 * 응답 크기 제한 적용
 *
 * @param text - 원본 텍스트
 * @param maxSizeOrOpts - 숫자(최대 길이) 또는 옵션 객체
 */
export declare function truncateResponse(text: string, maxSizeOrOpts?: number): string;
export declare function truncateResponse(text: string, maxSizeOrOpts?: TruncateOptions): string;
/**
 * 체인 도구용 섹션별 truncation
 *
 * 형식이 "▶ 섹션제목\n내용" 패턴인 텍스트에서
 * 각 섹션을 개별적으로 길이 제한하여 전체 균형 유지.
 *
 * @param text - "▶ 제목\n내용\n\n▶ 제목\n내용" 형태
 * @param totalMax - 전체 최대 길이
 * @param sectionMax - 섹션당 최대 길이 (기본: totalMax / 섹션 수)
 */
export declare function truncateSections(text: string, totalMax?: number, sectionMax?: number): string;
export {};
