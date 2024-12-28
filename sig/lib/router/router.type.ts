
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'router-outlet': any;
        }
    }
}

import { ComponentFunction } from "../types";

export interface ShouldEnterCallbackArgs {
    path: string,
    params: Record<string, string> | undefined,
    state: Record<string, unknown> | undefined,
    router: Router
}

export interface ShouldEnterCallback {
    (args: ShouldEnterCallbackArgs): boolean | RouterPushParameters | Promise<boolean | RouterPushParameters>;
}

export interface LoaderCallbackArgs {
    path: string,
    params: Record<string, string> | undefined,
    state: Record<string, unknown> | undefined,    
}

export type LoaderCallback = (args: LoaderCallbackArgs) => Promise<unknown> | unknown;

export type RouteComponentProps<LR = unknown> = {
    loaderResult: LR;
    params: Record<string, string>;
    state: Record<string, unknown>;
}

type RouteBaseConfig = {
    id?: string;
    memo?: boolean;
    shouldEnter?: ShouldEnterCallback;
    loader?: LoaderCallback;
    onEnter?: () => void;
    onLeave?: (params: Record<string, string>) => void;
    component: ComponentFunction;
}

export type RoutePathConfig = RouteBaseConfig & { path: string; children?: RouteConfig[]; };

export type RouteIndexConfig = RouteBaseConfig & { index: boolean; };

export type RouteConfig = RoutePathConfig | RouteIndexConfig;

export type RouterConfig = {
    routes: (RouteConfig & { default?: boolean })[];
    base?: string;
    onNoMatch?: () => void;
    layout?: ComponentFunction;
    ignoreRouterLink?: boolean;
    useViewTransition?: boolean;
};

export type NavigationMatchMetadata = {
    path: string;
    routes: RouteConfig[];
    params?: Record<string, string> | undefined;
}

export type RouterPushParameters = {
    path: string | URL, state?: Record<string, unknown>
}

export type Router = {
    rootId: string;
    container: HTMLElement;
    navigate: (path: string) => void;
    push: (path: string | URL, state?: Record<string, unknown>) => void;
    replace: (path: string | URL, state?: Record<string, unknown>) => void;
    state: Record<string, unknown>;
    matchedRouteId: string;
    navigateState: {
        isNavigating: boolean;
        // matchMetadata?: NavigationMatchMetadata;
    }
    navigationMatchMetadata?: NavigationMatchMetadata
};
