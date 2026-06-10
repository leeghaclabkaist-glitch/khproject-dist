/**
 * 법령 조문 파싱 유틸리티 (law-text.ts, batch-articles.ts 공통)
 */
/** 중첩 배열 평탄화 후 문자열 결합 (<img> 태그 제외) */
export declare function flattenContent(value: any): string;
/** 항 배열에서 내용 추출 (재귀적으로 호/목 처리) */
export declare function extractHangContent(hangInput: any[] | any): string;
/**
 * 조문단위 객체를 텍스트로 포맷팅 (law-text, batch-articles, article-detail 공통)
 * 조문 헤더(제X조 제목) + 본문 + 항/호/목을 결합하여 반환
 */
export declare function formatArticleUnit(unit: {
    조문여부?: string;
    조문번호?: string;
    조문가지번호?: string;
    조문제목?: string;
    조문내용?: unknown;
    항?: unknown;
}): {
    header: string;
    body: string;
} | null;
export declare function parseHangNumber(raw: unknown): number;
/** HTML 정리 - 엔티티 디코딩 순서 중요: &amp; 최후 처리 (이중 인코딩 방지) */
export declare function cleanHtml(text: string): string;
