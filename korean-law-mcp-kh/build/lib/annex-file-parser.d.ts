/**
 * 별표 파일 파서 — kordoc 위임
 *
 * HWPX/HWP5/PDF 모두 kordoc 통합 파서에 위임.
 * kordoc은 colAddr/rowAddr 기반 HWP5 셀 배치, PDF 라인+클러스터 이중 테이블 감지,
 * ZIP bomb 방지, 깨진 ZIP 복구 등 강화된 파싱 기능을 제공.
 *
 * @see https://github.com/chrisryugj/kordoc
 */
import type { FileType } from "kordoc";
export interface AnnexParseResult {
    success: boolean;
    markdown?: string;
    fileType: FileType;
    /** 이미지 기반 PDF 여부 (텍스트 추출 불가) */
    isImageBased?: boolean;
    /** PDF 페이지 수 */
    pageCount?: number;
    error?: string;
}
export declare function parseAnnexFile(buffer: ArrayBuffer): Promise<AnnexParseResult>;
