/**
 * law.go.kr JS 안티봇 우회 (클라우드 IP 대응)
 *
 * 법제처는 클라우드 IP(GCP/AWS/Fly 등)에서 온 요청에 API 데이터 대신
 * `location.assign(...)` JS 리다이렉트 페이지를 반환할 때가 있다. 이 페이지의
 * 난독화된 URL을 파싱해 토큰 URL로 재요청하면 우회된다.
 * (LexLink-ko-mcp client.py의 `_follow_antibot` 접근을 이식)
 *
 * 로컬/등록 IP에서는 이 페이지가 오지 않으므로 평상시엔 no-op이다. Fly 등
 * 클라우드 배포에서 UA/Referer만으로 뚫리지 않는 경우의 방어층.
 *
 * 한계: Node fetch(undici)는 쿠키 jar가 없어 "안티봇 홉이 심은 세션 쿠키로
 * 원본 재시도 성공" 경로는 제한적이다. 주 경로는 토큰 URL 직접 파싱이다.
 */
/**
 * 안티봇 JS의 두 난독화 패턴에서 리다이렉트 경로를 복원한다.
 *
 * - 패턴 A(concat): `x={t:'..',h:'..',o:'..'}; return x.t+x.h+x.o`
 * - 패턴 B(substr): `x={o:'..',c:N},z=M; return o.substr(0,c)+o.substr(c+z)`
 */
export declare function parseAntibotUrl(html: string): string | null;
/**
 * 응답이 JS 안티봇 페이지면 우회한 새 Response를, 아니면 null(원본 유지)을 반환.
 * 최대 maxHops까지 location.assign 리다이렉트를 추적한다.
 */
export declare function followLawAntibot(response: Response, originalUrl: string, headers: Headers, timeout: number, maxHops?: number): Promise<Response | null>;
