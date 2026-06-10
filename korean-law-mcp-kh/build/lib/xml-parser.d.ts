/**
 * 공통 XML 파싱 유틸리티
 * 법제처 API 응답 XML 파싱용
 */
/**
 * HTML 태그 제거 (검색 결과의 하이라이트 태그 등)
 * 예: <strong class="tbl_tx_type">지방</strong>자치법 → 지방자치법
 */
export declare function stripHtml(text: string): string;
/**
 * XML 태그에서 텍스트 추출 (CDATA 지원)
 */
export declare function extractTag(content: string, tag: string): string;
/**
 * 검색 결과 XML 파싱
 * @param xml 전체 XML 문자열
 * @param rootTag 루트 태그 (예: PrecSearch, Expc, Decc)
 * @param itemTag 항목 태그 (예: prec, expc, decc)
 * @param fieldExtractor 필드 추출 함수
 * @param options 추가 옵션 (totalTag, pageTag 커스터마이징)
 */
export declare function parseSearchXML<T>(xml: string, rootTag: string, itemTag: string, fieldExtractor: (content: string) => T, options?: {
    totalTag?: string;
    pageTag?: string;
    useIndexOf?: boolean;
}): {
    totalCnt: number;
    page: number;
    items: T[];
};
/**
 * 판례 검색 결과 파싱
 */
export interface PrecedentItem {
    판례일련번호: string;
    판례명: string;
    사건번호: string;
    법원명: string;
    선고일자: string;
    판결유형: string;
    판례상세링크: string;
}
export declare function parsePrecedentXML(xml: string): {
    totalCnt: number;
    page: number;
    items: PrecedentItem[];
};
/**
 * 법령해석례 검색 결과 파싱
 */
export interface InterpretationItem {
    법령해석례일련번호: string;
    안건명: string;
    법령해석례번호: string;
    회신일자: string;
    해석기관명: string;
    법령해석례상세링크: string;
    질의요지: string;
    회답: string;
    회답일자: string;
    소관부처명: string;
}
export declare function parseInterpretationXML(xml: string): {
    totalCnt: number;
    page: number;
    items: InterpretationItem[];
};
/**
 * 행정심판례 검색 결과 파싱
 */
export interface AdminAppealItem {
    행정심판재결례일련번호: string;
    사건명: string;
    사건번호: string;
    처분일자: string;
    의결일자: string;
    처분청: string;
    재결청: string;
    재결구분명: string;
    재결구분코드: string;
    행정심판례상세링크: string;
}
export declare function parseAdminAppealXML(xml: string): {
    totalCnt: number;
    page: number;
    items: AdminAppealItem[];
};
/**
 * 헌법재판소 결정례 검색 결과 파싱
 */
export interface ConstitutionalItem {
    헌재결정례일련번호: string;
    사건명: string;
    사건번호: string;
    종국일자: string;
    헌재결정례상세링크: string;
}
export declare function parseConstitutionalXML(xml: string): {
    totalCnt: number;
    page: number;
    items: ConstitutionalItem[];
};
/**
 * 조세심판원 재결례 검색 결과 파싱
 */
export interface TaxTribunalItem {
    특별행정심판재결례일련번호: string;
    사건명: string;
    청구번호: string;
    처분일자: string;
    의결일자: string;
    처분청: string;
    재결청: string;
    재결구분명: string;
    재결구분코드: string;
    행정심판재결례상세링크: string;
}
export declare function parseTaxTribunalXML(xml: string): {
    totalCnt: number;
    page: number;
    items: TaxTribunalItem[];
};
/**
 * 조약 검색 결과 파싱
 */
export interface TreatyItem {
    조약일련번호: string;
    조약명: string;
    조약번호: string;
    체결일자: string;
    발효일자: string;
    조약구분: string;
    조약상세링크: string;
}
export declare function parseTreatyXML(xml: string): {
    totalCnt: number;
    page: number;
    items: TreatyItem[];
};
/**
 * 관세해석례 검색 결과 파싱
 */
export interface CustomsItem {
    관세행정해석례일련번호: string;
    안건명: string;
    질의내용: string;
    회신일자: string;
    처리부서: string;
}
export declare function parseCustomsXML(xml: string): {
    totalCnt: number;
    page: number;
    items: CustomsItem[];
};
