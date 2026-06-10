/**
 * 공용 법령 검색 유틸 — chains / verify_citations 등에서 공유.
 *
 * 핵심: 법제처 lawSearch API는 부분 문자열 매칭 특성이 있어 "민법" → "난민법"
 * 같은 엉뚱한 매칭이 발생한다. scoreLawRelevance로 정확 매칭 우선 정렬하여
 * 첫 결과 신뢰 가능하게 만든다.
 */
import type { LawApiClient } from "./api-client.js";
export interface LawInfo {
    lawName: string;
    lawId: string;
    mst: string;
    lawType: string;
}
/** 법령명이 아닌 부가 키워드 제거 (법제처 lawSearch API는 법령명 검색이므로) */
export declare const NON_LAW_NAME_RE: RegExp;
export declare function stripNonLawKeywords(query: string): string;
/** XML에서 법령 정보 파싱 */
export declare function parseLawXml(xmlText: string, max: number): LawInfo[];
/** 쿼리 대비 법령명 관련도 점수 (높을수록 관련) */
export declare function scoreLawRelevance(lawName: string, query: string, queryWords: string[]): number;
/**
 * 법령 검색 + 관련도 정렬 + 캐싱.
 * 1차: 원본 쿼리 → 2차: 부가키워드 제거 → 3차: 법령명 패턴 직접 추출
 * 이후 scoreLawRelevance로 정렬.
 *
 * @param searchDisplay 법제처 API display 파라미터 — 짧은 법령명("상법"은 100개 중 34번째)
 *                      정확 매칭 찾으려면 크게(100+). 기본 20은 체인 도구용.
 */
export declare function findLaws(apiClient: LawApiClient, query: string, apiKey?: string, max?: number, searchDisplay?: number): Promise<LawInfo[]>;
