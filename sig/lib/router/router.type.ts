import { ComponentFunction } from "../types";

export type RouteCommonConfig = {
    path: string;
    id?: string;
    memo?: boolean;
    shouldEnter?: (
        params: Record<string, string>,
        state?: Record<string, unknown>,) => boolean;
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
    routes: RouteConfig[];
    base?: string;
    onNoMatch?: () => void;
    layout?: ComponentFunction;
    ignoreRouterLink?: boolean;
    useViewTransition?: boolean;
};

export type Router = {
    rootId: string;
    container: HTMLElement;
    navigate: (path: string) => void;
    state: Record<string, unknown>;
    push: (path: string | URL, state?: Record<string, unknown>) => void
    matchedRouteId: string;
    navigationMatchMetadata?: {
        path: string;
        route: RouteConfig;
        params?: Record<string, string>;
    }
};
