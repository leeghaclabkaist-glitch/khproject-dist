import { config as loadDotenv } from "dotenv";
loadDotenv({ quiet: true });
const DEFAULT_LAW_API_PROTOCOL = "https";
export function getLawApiProtocol() {
    const raw = (process.env.LAW_API_PROTOCOL || "").trim().toLowerCase();
    if (raw === "http" || raw === "https")
        return raw;
    return DEFAULT_LAW_API_PROTOCOL;
}
export function getLawApiBaseUrl() {
    return `${getLawApiProtocol()}://www.law.go.kr/DRF`;
}
export function getLawSiteBaseUrl() {
    return `${getLawApiProtocol()}://www.law.go.kr`;
}
