import { SSRFetchOptions } from "./ssr.types";
import { CreateRootOptions } from "../dom-render/create-root";
import { appendQueryParams } from "./append-query-params";
import { insertPathParams } from "./insert-path-params";

export async function fetchHtml(
    ssrFetch: string | SSRFetchOptions, 
    rootOptions?: CreateRootOptions
): Promise<string> {
    try {
        if(typeof ssrFetch === 'string') {
            const margeUrl = concatUrl(ssrFetch, rootOptions?.ssr?.baseUrl);
            return await fetchSSRHtml(margeUrl);
        } else {
            const { url, params, query, config } = ssrFetch;
            
            const urlWithQuery = query ? appendQueryParams(url, query) : url;
            const urlWithParams = params ? insertPathParams(urlWithQuery, params) : urlWithQuery;
            const margeUrl = concatUrl(urlWithParams, rootOptions?.ssr?.baseUrl);

            const margeConfig = {
                ...rootOptions?.ssr?.config,
                ...config,
            };
            return await fetchSSRHtml(margeUrl, margeConfig);
        }
    } catch (error) {
        throw new Error(`Failed to fetch SSR HTML: ${(<Error>error)?.message}`);
    }
}

async function fetchSSRHtml(url: string, config?: RequestInit): Promise<string> {
    const res = await fetch(url, config);
    return await res.text();
}

function concatUrl(url: string, baseUrl = '') {
    if(!baseUrl || isFullUrl(url)) {
        return url;
    }
    return new URL(url, baseUrl).href;
}

function isFullUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}
