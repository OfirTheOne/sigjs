import type { Signal, Signalize } from "../signal/signal.types";

export type SSRFetchOptions = {
    url: string,
    query?: Record<string, string>,
    params?: Record<string, string>,
    config: RequestInit,
};

export type SSRFetch 
    = (() => Promise<string>)  
    | string
    | Signal<string> 
    | Signalize<SSRFetchOptions>;


export interface RootSSRMetadata {
    baseUrl?: string
    config?: RequestInit;
    onError?: (error: Error) => void;
    allowOutlet?: boolean;
}
