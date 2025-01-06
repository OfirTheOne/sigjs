
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'router-outlet': any;
        }
    }
}

import { ComponentFunction } from "../types";

/**
 * The should enter callback arguments
 * 
 * used in {@link ShouldEnterCallback}
 */
export interface ShouldEnterCallbackArgs {
    path: string,
    params: Record<string, string> | undefined,
    state: Record<string, unknown> | undefined,
    router: Router
}

/**
 * The should enter callback
 * 
 * used in {@link RouteBaseConfig.shouldEnter}
 */
export interface ShouldEnterCallback {
    (args: ShouldEnterCallbackArgs): boolean | RouterPushParameters | Promise<boolean | RouterPushParameters>;
}

/**
 * The loader callback arguments
 *
 * used in {@link LoaderCallback}   
 */  
export interface LoaderCallbackArgs {
    path: string,
    params: Record<string, string> | undefined,
    state: Record<string, unknown> | undefined,    
}

/**
 * The loader callback
 * 
 * used in {@link RouteBaseConfig.loader}
 */
export type LoaderCallback = (args: LoaderCallbackArgs) => Promise<unknown> | unknown;


/**
 * The route component props
 * 
 * used in {@link RouteBaseConfig.component} 
 */
export type RouteComponentProps<LR = unknown> = {
    /**
     * The loader {@link RouteBaseConfig.loader} result
     */
    loaderResult: LR;
    /**
     * The route params
     */
    params: Record<string, string>;
    /**
     * The route state 
     */
    state: Record<string, unknown>;
}

type RouteBaseConfig = {
    /**
     * The id of the route
     */ 
    id?: string;
    /**
     * Whether to memoize the route
     */
    memo?: boolean;
    /**
     * The function to call before entering the route
     */ 
    shouldEnter?: ShouldEnterCallback;
    /**
     * The function to call to load the route
     */
    loader?: LoaderCallback;
    /**
     * The function to call when entering the route
     */ 
    onEnter?: () => void;
    /**
     * The function to call when leaving the route
     */
    onLeave?: (params: Record<string, string>) => void;
    /**
     * The component of the route
     * component props: {@link RouteComponentProps}
     */
    component: ComponentFunction<RouteComponentProps>;
}

/**
 * The path route configuration object.
 * Path routes have a path and can have children.
 * used in {@link RouterConfig}
 */
export type RoutePathConfig = RouteBaseConfig & { 
    /**
     * The path of the route
     * @example
     * '/categories'
     * '/recipe/:id'
     */ 
    path: string; 
    /**
     * The children of the route
     */
    children?: RouteConfig[]; 
};

/**
 * The index route configuration object.
 * Index routes do not have path and are used to render the default route when the parent route is matched.
 * Index routes do not have children. 
 * used in {@link RouterConfig}
 */ 
export type RouteIndexConfig = RouteBaseConfig & { 
    /**
     * Whether the route is an index route
     */
    index: boolean; 
};


/**
 * The route configuration object
 * 
 * used in {@link RouterConfig} 
 */ 
export type RouteConfig = RoutePathConfig | RouteIndexConfig;


/**
 * The router configuration object
 * 
 * used in {@link buildRouter}
 */ 
export type RouterConfig = {
    /**
     * The routes of the router
     */ 
    routes: (RouteConfig & { default?: boolean })[];
    /**
     * The base path of the router
     */ 
    base?: string;
    /**
     * The function to call when no match is found
     */ 
    onNoMatch?: () => void;
    /**
     * The layout component of the router
     * @deprecated
     */
    layout?: ComponentFunction;
    /**
     * Whether to ignore router links
     */
    ignoreRouterLink?: boolean;
    /**
     * Whether to use view transitions
     */ 
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


/**
 * The router object
 * 
 * used in {@link getRouter}
 */ 
export type Router = {
    /**
     * The id of the root element
     */
    rootId: string;
    /**
     * The container element of the router
     */
    container: HTMLElement;
    /**
     * Navigate to a new route
     */
    navigate: (path: string) => void;
    /**
     * Push a new route
     */ 
    push: (path: string | URL, state?: Record<string, unknown>) => void;
    /**
     * Replace the current route
     */
    replace: (path: string | URL, state?: Record<string, unknown>) => void;
    /**
     * The state of the router
     */
    state: Record<string, unknown>;
    /**
     * The id of the matched route
     */
    matchedRouteId: string;
    /**
     * The state of the navigation
     */
    navigateState: {
        isNavigating: boolean;
        // matchMetadata?: NavigationMatchMetadata;
    }
    /**
     * The metadata of the matched route
     */
    navigationMatchMetadata?: NavigationMatchMetadata
};
