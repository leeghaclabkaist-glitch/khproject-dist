/**
 * 법제처 API 클라이언트
 */
export declare class LawApiClient {
    private defaultApiKey;
    constructor(config: {
        apiKey: string;
    });
    /**
     * API 키 결정 순서:
     * 1. 요청별 override 키
     * 2. 현재 요청 컨텍스트의 API 키 (HTTP stateless 모드)
     * 3. 환경변수 LAW_OC
     * 4. 생성자에서 받은 기본 키
     */
    private getApiKey;
    /** HTTP 응답 검증 — 상태 코드 분류 + HTML 에러 페이지 감지 */
    private throwIfError;
    /** 현재 응답 타입 반환 (환경변수 LAW_RESPONSE_TYPE, 기본값 XML) */
    private getResponseType;
    /** 응답 본문이 HTML 에러 페이지인지 확인 */
    private checkHtmlError;
    /**
     * 법령 검색
     * @param display 결과 개수 (기본값 법제처 API default, 짧은 법령명("상법" 등) 정확 매칭 찾으려면 큰 값 권장)
     */
    searchLaw(query: string, apiKey?: string, display?: number): Promise<string>;
    /**
     * 현행법령 조회
     */
    getLawText(params: {
        mst?: string;
        lawId?: string;
        jo?: string;
        efYd?: string;
        apiKey?: string;
    }): Promise<string>;
    /**
     * 신구법 대조
     */
    compareOldNew(params: {
        mst?: string;
        lawId?: string;
        ld?: string;
        ln?: string;
        apiKey?: string;
    }): Promise<string>;
    /**
     * 3단비교 (위임조문)
     */
    getThreeTier(params: {
        mst?: string;
        lawId?: string;
        knd?: "1" | "2";
        apiKey?: string;
    }): Promise<string>;
    /**
     * 행정규칙 검색
     */
    searchAdminRule(params: {
        query: string;
        knd?: string;
        apiKey?: string;
    }): Promise<string>;
    /**
     * 행정규칙 조회
     */
    getAdminRule(id: string, apiKey?: string): Promise<string>;
    /**
     * 별표/서식 조회
     * LexDiff 방식: lawSearch.do + target=licbyl
     */
    getAnnexes(params: {
        lawName: string;
        knd?: "1" | "2" | "3" | "4" | "5";
        apiKey?: string;
    }): Promise<string>;
    /**
     * 법령 종류 판별
     */
    private detectLawType;
    /**
     * 자치법규 검색
     */
    searchOrdinance(params: {
        query: string;
        display?: number;
        apiKey?: string;
    }): Promise<string>;
    /**
     * 자치법규 조회
     */
    getOrdinance(ordinSeq: string, jo?: string, apiKey?: string): Promise<string>;
    /**
     * 일자별 조문 개정 이력 조회
     */
    getArticleHistory(params: {
        lawId?: string;
        jo?: string;
        regDt?: string;
        fromRegDt?: string;
        toRegDt?: string;
        org?: string;
        page?: number;
        apiKey?: string;
    }): Promise<string>;
    /**
     * 범용 API 호출 (fetchWithRetry 기반)
     */
    fetchApi(params: {
        endpoint: "lawSearch.do" | "lawService.do";
        target: string;
        type?: "XML" | "JSON" | "HTML";
        extraParams?: Record<string, string>;
        apiKey?: string;
    }): Promise<string>;
    /**
     * 법령 변경이력 목록 조회
     */
    getLawHistory(params: {
        regDt: string;
        org?: string;
        display?: number;
        page?: number;
        apiKey?: string;
    }): Promise<string>;
}
