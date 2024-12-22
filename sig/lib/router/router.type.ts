
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

export type RouteCommonConfig = {
    path: string;
    id?: string;
    children?: RouteConfig[];
    memo?: boolean;
    shouldEnter?: ShouldEnterCallback;
    loader?: LoaderCallback;
    onEnter?: () => void;
    onLeave?: (params: Record<string, string>) => void;
};
// export type RouteAsyncConfig = {
//     component: AsyncComponentFunction;
//     fallback?: ComponentFunction;
//     loading?: ComponentFunction;
// };
export type RouteSyncConfig = {
    component: ComponentFunction;
};

export type RouteConfig = RouteCommonConfig & RouteSyncConfig; // (RouteAsyncConfig | RouteSyncConfig);

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
    state: Record<string, unknown>;
    push: (path: string | URL, state?: Record<string, unknown>) => void
    matchedRouteId: string;
    navigateState: {
        isNavigating: boolean;
        // matchMetadata?: NavigationMatchMetadata;
    }
    navigationMatchMetadata?: NavigationMatchMetadata
};
