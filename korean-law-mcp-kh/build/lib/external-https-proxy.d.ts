export interface ExternalHttpsProxyConfig {
    host: string;
    port: number;
    rejectUnauthorized: boolean;
    proxyAuthorization?: string;
}
export interface ExternalHttpsRequestOptions {
    method?: string;
    headers?: Record<string, string> | Array<[string, string]> | Headers;
    body?: string;
    timeout?: number;
}
export interface ExternalHttpsResponse {
    ok: boolean;
    status: number;
    headers: Record<string, string | string[] | undefined>;
    text: string;
}
export declare function getExternalHttpsProxyConfig(): ExternalHttpsProxyConfig | null;
export declare function requestExternalHttps(url: string, options: ExternalHttpsRequestOptions, config?: ExternalHttpsProxyConfig | null): Promise<ExternalHttpsResponse>;
