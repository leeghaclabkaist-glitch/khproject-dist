/**
 * Decision Compact — 판례/헌재/행심 응답 토큰 최적화 유틸
 *
 * B. compactBody: 본문("이유"/"전문")을 "앞 800자 + 중략 + 뒤 400자"로 계단식 축약.
 *    판시사항/판결요지/주문은 이미 별도 필드로 분리 반환되므로 본문에만 적용.
 *    문장 경계(마침표·판례 특유 종결어미)를 존중하여 중간 절단 방지.
 *
 * C. densifyLawRefs / densifyPrecedentRefs: 참조조문·참조판례의 서지 잉여 제거.
 *    괄호 안 조문명, "선고"/"판결" 군더더기, 날짜 공백 압축. 구조 유지 + 압축.
 *
 * D. compactLongSections: 통합 후처리용. 응답 텍스트에서 알려진 긴 섹션 헤더
 *    ("이유:", "전문:", "회답:" 등)를 찾아 해당 섹션 본문에 compactBody 적용.
 *    unified-decisions.ts가 도메인별 스키마를 바꾸지 않고 full=false 기본값을
 *    강제하기 위해 사용.
 *
 * 안전성: 모든 함수는 매칭 실패 / 빈 입력 / 짧은 입력 시 **원본 그대로 반환**.
 */
export interface CompactOptions {
    /** true 시 축약 비활성 → 원본 반환 */
    full?: boolean;
    /** 앞쪽 보존 길이 (기본 800자) */
    headSize?: number;
    /** 뒤쪽 보존 길이 (기본 400자) */
    tailSize?: number;
    /** head+tail+minSave 이하면 축약 안 함 (기본 500자) */
    minSave?: number;
}
/**
 * 본문 계단식 축약
 * - 앞 800자 + 중략 마커 + 뒤 400자
 * - 문장 경계 가드: 마침표/판례 종결어미/빈 줄에서 끊기
 * - head 기준 50% 이상 위치에 경계 없으면 원시 슬라이스 사용 (fallback)
 */
export declare function compactBody(text: string, opts?: CompactOptions): string;
/**
 * 참조조문 densify
 *
 * 압축 전략:
 *   1) 조문명 괄호 설명 제거: "제390조(채무불이행과 손해배상)" → "제390조"
 *   2) 연속 공백/구분자 정리
 *
 * 조문명 괄호는 평균 15~30자 × 참조조문 5~10개 = 150~300자 절감 (40%).
 * 법령명 자체는 건드리지 않음 — LLM이 후속 도구 호출 시 파싱 필요.
 */
export declare function densifyLawRefs(text: string): string;
/**
 * 참조판례 densify
 *
 * 압축 전략:
 *   1) "선고" 생략: "대법원 2020. 3. 26. 선고 2018두56077 판결" → "대법원 2020.3.26. 2018두56077"
 *   2) 날짜 공백 압축: "2020. 3. 26." → "2020.3.26."
 *   3) "판결" 접미어 제거
 *   4) 구분자 정리
 */
export declare function densifyPrecedentRefs(text: string): string;
/**
 * 본문에서 판시사항/판결요지가 반복 등장하면 제거
 *
 * 법제처 API 판례 응답은 `판시사항`, `판결요지`가 별도 필드로 나오지만
 * `판례내용`(전문) 앞쪽에 같은 내용이 반복되는 케이스가 많다.
 * 이미 상단에 렌더된 부분을 본문에서 제거하여 LLM 중복 소비 방지.
 *
 * 경계 탐지: 요약의 앞 80자로 시작점(idx)을, 요약의 끝 60자로 실제 종료점(endIdx)을
 * 탐지. 끝 매칭이 실패하면 보수적으로 s.length만큼만 제거하여 본문 다른 내용이
 * 같이 날아가는 사고 방지.
 */
export declare function stripRepeatedSummary(body: string, summaries: Array<string | undefined>): string;
export declare function compactLongSections(text: string): string;
