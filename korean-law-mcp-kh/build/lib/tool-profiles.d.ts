/**
 * 도구 카테고리 + 별칭 — discover_tools 자연어 매칭용.
 *
 * (lite/full 프로필은 v3.5.1에서 제거됨: V3_EXPOSED 도입 후 실질 미사용.
 *  tool-registry.ts가 V3_EXPOSED 16개로 고정 노출 → 프로필 분기 의미 상실)
 */
/**
 * 카테고리/도구명 별칭 — discover_tools가 사용자 자연어 입력을 매칭하기 위한 힌트.
 * 한국어 법률 실무에서 흔히 쓰이는 비공식 용어와 도구를 연결.
 *
 * 예시: "조세심판원" → search_tax_tribunal_decisions
 *       "김영란법" → search_law (약칭은 search-normalizer가 처리)
 *       "하자" → search_precedents (민사 분쟁 키워드)
 */
export declare const TOOL_ALIASES: Record<string, string[]>;
/** 도구 카테고리 매핑 (discover_tools용) */
export declare const TOOL_CATEGORIES: Record<string, string[]>;
