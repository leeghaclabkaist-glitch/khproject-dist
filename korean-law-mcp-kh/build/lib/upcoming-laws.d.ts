/**
 * 시행예정 법령 감지 — search_law 보조 (target=eflaw).
 *
 * 제명변경 개정(예: 「데이터기반행정 활성화에 관한 법률」 → 「인공지능 및
 * 데이터 기반 행정 활성화에 관한 법률」, 2026-08-28 시행)이 공포~시행 사이에는
 * 현행(target=law) 검색에 신명칭이 없어 LLM이 "법령 없음"으로 오판한다.
 * eflaw 보조검색으로 시행예정본을 병기해 신·구 명칭 매핑과 시행일을 알려준다.
 */
import type { LawApiClient } from "./api-client.js";
export interface UpcomingLaw {
    name: string;
    lawId: string;
    mst: string;
    effDates: string[];
    promDate: string;
    promNo: string;
    revisionType: string;
    lawType: string;
}
/** eflaw 검색 XML에서 "시행예정" 항목만 추출 (동일 MST의 복수 시행일 병합) */
export declare function parseUpcomingXml(xmlText: string): UpcomingLaw[];
/** 시행예정 법령 조회 — 보조 정보이므로 실패는 전파하지 않고 빈 배열 */
export declare function fetchUpcomingLaws(apiClient: LawApiClient, query: string, apiKey?: string): Promise<UpcomingLaw[]>;
/**
 * 검색 결과에 붙일 시행예정 안내 노트.
 * - 법령ID가 결과와 같고 이름이 다르면 → 제명변경 예정 (신·구 명칭 매핑)
 * - 법령ID가 같고 이름도 같으면 → 개정 시행예정
 * - 결과에 없는 법령ID → 공포됐지만 미시행인 신규 법령 (현행 검색 0건의 원인)
 */
export declare function buildUpcomingNotes(hits: Array<{
    name: string;
    lawId: string;
}>, upcoming: UpcomingLaw[]): string;
