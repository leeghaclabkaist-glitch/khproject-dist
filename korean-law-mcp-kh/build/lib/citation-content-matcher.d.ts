/**
 * 법령 조문 인용 내용 일치 검증
 *
 * LLM이 "제5조(목적)"로 인용한 내용이 실제 제5조의 본문/제목과 의미적으로
 * 일치하는가를 다층 매칭으로 판정한다. 존재 검증만으로는 "존재하는 조문에
 * 엉뚱한 내용 환각"을 잡지 못하기 때문.
 *
 * 레이어:
 *  L1 (exact)   — 정규화 후 연속 30자+ 공통 substring
 *  L2 (jaccard) — 문자 bigram Jaccard ≥ 0.25 (조사/어미 차이에 robust)
 *
 * ⚠️ LexDiff(lib/citation-content-matcher.ts)에서 이식한 순수함수. 수정 시
 *    원본 확인 필수 (CLAUDE.md 규칙 1: LexDiff 이식 코드 무단 수정 금지).
 *    단, normalizeLegalText의 zero-width/NBSP 제거는 유니코드 이스케이프가
 *    소스에 실제 제어문자로 박히는 것을 피하려 코드포인트 비교로 재구현함
 *    (동작 동일).
 */
export type MatchMethod = 'exact' | 'token-jaccard' | 'semantic' | 'mismatch';
export interface ContentMatchResult {
    matched: boolean;
    method: MatchMethod;
    score: number;
    normalizedLenClaim: number;
    normalizedLenActual: number;
}
/**
 * 법률 텍스트 정규화:
 *  - 원문자 ①②③ → (1)(2)(3)
 *  - 「」, 『』 괄호 제거
 *  - 중점/구분자(·•) → 공백
 *  - whitespace 단일 공백
 *  - NBSP(U+00A0)/zero-width 제거·치환
 */
export declare function normalizeLegalText(s: string): string;
/**
 * LLM claim 텍스트와 실제 조문 본문/제목을 비교해 일치 여부 판정.
 * claim 또는 actual이 비어있으면 matched=false.
 */
export declare function matchCitationContent(claim: string, actual: string): ContentMatchResult;
