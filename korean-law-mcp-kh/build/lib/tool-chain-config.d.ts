/**
 * 검색 → 상세조회 자동 체인 설정
 *
 * 자연어 CLI에서 search_* 실행 후 첫 번째 결과의 상세 내용을
 * 자동으로 조회하기 위한 매핑 테이블.
 */
export interface SearchDetailChain {
    /** 상세조회 도구 이름 */
    detailTool: string;
    /** 상세조회 도구의 ID 파라미터 이름 */
    detailParam: string;
    /** 검색 결과 텍스트에서 첫 번째 ID를 추출하는 정규식 (group 1) */
    idRegex: RegExp;
}
export declare const SEARCH_DETAIL_CHAINS: Record<string, SearchDetailChain>;
