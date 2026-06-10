/**
 * 3단비교 JSON 파싱
 * LexDiff에서 이식 (debugLogger 제거)
 */
import type { ThreeTierData } from "./types.js";
/**
 * 위임조문 3단비교 JSON 파싱 (knd=2)
 */
export declare function parseThreeTierDelegation(jsonData: any): ThreeTierData;
