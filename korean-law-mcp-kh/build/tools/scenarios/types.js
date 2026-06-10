/** callTool 래퍼 — 체인과 동일 시그니처 */
export async function callTool(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
handler, apiClient, input) {
    try {
        const result = await handler(apiClient, input);
        return { text: result.content?.[0]?.text || "", isError: !!result.isError };
    }
    catch (e) {
        return { text: `오류: ${e instanceof Error ? e.message : String(e)}`, isError: true };
    }
}
/** ScenarioSection → 포맷팅된 문자열 */
export function formatSections(sections) {
    return sections
        .map(s => {
        if (s.isError) {
            return s.content ? `\n▶ ${s.title} (조회 실패: ${s.content.slice(0, 80)})\n` : `\n▶ ${s.title} (조회 실패)\n`;
        }
        if (!s.content?.trim())
            return "";
        return `\n▶ ${s.title}\n${s.content}\n`;
    })
        .filter(Boolean)
        .join("");
}
/** suggested_actions → 포맷팅된 문자열 */
export function formatSuggestedActions(actions) {
    if (actions.length === 0)
        return "";
    const lines = actions.map((a, i) => `${i + 1}. "${a}"`);
    return `\n━━━ 이어서 할 수 있는 조회 ━━━\n${lines.join("\n")}\n`;
}
