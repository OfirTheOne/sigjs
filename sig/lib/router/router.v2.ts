
import logger from "@/common/logger/logger";
import { uniqueId } from "@/common/unique-id";
import { getRenderedRoot } from "@/core/global";
import { createElement } from "@/jsx";
import { DOM } from "@/core/html";
import { matchRoute } from "./match-algorithm/nested-match-route";
import { keyBuilder } from "@/common/key-builder/key-builder";
import { getActiveContext } from "@/core/dom-render/component-context/component-context";
import { handleRoutesMatchedResult } from "./build-router/handle-routes-matched-result";
import type { RootElementWithMetadata } from "@/core/dom-render/create-root";
import type { VirtualElement } from "@/types";
import type { Router, RouterConfig, RouteConfig, OnRouteChangeCallback } from "./router.type";

const routersStore: Record<string, Router> = {};

customElements.define('app-router', class extends HTMLElement { });

customElements.define('router-outlet', class extends HTMLElement { });

const history = window.history;

/**
 * Get the current router instance
 * @returns The current router instance, must be called within a router context
 * @throws {Error} If called outside of a router context  
 * 
 * using {@link Router}
 * 
 * @example
 * const router = getRouter();
 * console.log(router);
 * // console logs:
 * // > { container: HTMLElement, push: Function, replace: Function, navigate: Function, ... }
 */
function getRouter(): Router {
    const renderedRootId = getRenderedRoot();
    if (!renderedRootId) {
        throw new Error('Out of a root context');
    }
    const router = routersStore[renderedRootId.id];
    if (!router) {
        throw new Error('No router found');
    }
    return router;
}

/**
 * Get the params of the current route
 * @returns The params of the current route
 * @throws {Error} If called outside of a router context
 * @example
 * // Assume the current route is '/user/1'
 * // And the route path is defined as '/user/:id',
 * const params = getParams();
 * console.log(params);
 * // console logs:
 * // > { id: '1' }
 */
function getParams(): Record<string, string> {
    const router = getRouter();
    if (router.navigationMatchMetadata) {
        return router.navigationMatchMetadata.params || {};
    }
    return {};
}

const appendIdToAllRouteTree = (routes: RouteConfig[]): RouteConfig[] => {
    return routes.map(route => {
        return {
            ...route,
            id: route.id ? route.id : uniqueId(),
            children: 'children' in route ? (
                route.children ? appendIdToAllRouteTree(route.children) : route.children
            ) : undefined
        }
    });
}

function buildRouter(config: RouterConfig, renderedRoot: RootElementWithMetadata): Router {
    window.addEventListener('popstate', (event) => {
        logger.log(event.state);
        navigate(window.location.pathname);
    });
    
    const _onRouteChangeCallbacks: OnRouteChangeCallback[] = [];
    const { routes, base = '', onNoMatch, useViewTransition = true } = config;
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    const renderKey = keyBuilder(context.key).push(`router:${renderedRoot.id}`);
    const redirectStack: Parameters<typeof push>[] = [];
    const routesWithId = appendIdToAllRouteTree(routes);
    const routerElement = DOM.createElement('app-router', renderKey);
    const memoRenderedRoute: Record<string, HTMLElement | Text | ChildNode[]> = {};

    const router: Router = {
        navigateState: {
            isNavigating: false,
        },
        rootId: renderedRoot.id,
        container: routerElement,
        push,
        replace,
        navigate,
        get state() { return history.state; },
        matchedRouteId: '',
        events: {
            onRouteChange: (callback) => {
                _onRouteChangeCallbacks.push(callback);
            }
        }
    };
    routersStore[router.rootId] = router;
    
    function replace(path: string | URL, state?: Record<string, unknown>) {

        if (router.navigateState.isNavigating) {
            logger.warn('Router is currently navigating');
            redirectStack.push([path, state]);
            return;
        }
        const prevPathname = window.location.pathname;
        history.replaceState(state, "", path);
        if (prevPathname !== window.location.pathname) {
            navigate(window.location.pathname);
        }
    }

    function push(path: string | URL, state?: Record<string, unknown>) {

        if (router.navigateState.isNavigating) {
            logger.warn('Router is currently navigating');
            redirectStack.push([path, state]);
            return;
        }
        const prevPathname = window.location.pathname;
        history.pushState(state, "", path);
        if (prevPathname !== window.location.pathname) {
            navigate(window.location.pathname);
        }
    }

    function navigate(path: string) {
        if (router.navigateState.isNavigating) {
            logger.warn('Router is currently navigating');
            return;
        }

        // Find the route that matches the path
        const matchResult = matchRoute(path, routesWithId);
        if (!matchResult) {
            if (onNoMatch) {
                onNoMatch();
            }
            logger.warn(`No route found for path ${path}`);
            return;
        }

        const { routes, params } = matchResult;

        if (router.navigationMatchMetadata) {
            const { routes: prevRoutes, params: prevParams = {} } = router.navigationMatchMetadata;
            prevRoutes.forEach((prevRoute) => {
                if (prevRoute.onLeave) prevRoute.onLeave(prevParams);
            });
        }
    
        router.navigationMatchMetadata = {
            path,
            routes,
            params
        };

        if (routes.length === 0) {
            logger.warn(`No route found for path ${path}`);
            return;
        }

        function onRouteChange() {
            _onRouteChangeCallbacks.forEach(callback => {
                callback({ path, params, state: history.state });
            });
        }

        const delayedHandleRoutesMatchedResult = () => {
            handleRoutesMatchedResult(
                router,
                routes,
                params,
                path,
                base,
                memoRenderedRoute,
                renderKey,
                onRouteChange
            ).then(() => {
                if(redirectStack.length) {
                    const redirectParameters = redirectStack.at(-1);
                    if(redirectParameters) {
                        redirectStack.length = 0;
                        const [path, state] = redirectParameters;
                        push(path, state);
                    }
                }
            });
        }
        if (!useViewTransition) {
            delayedHandleRoutesMatchedResult();
        } else {
            applyViewTransition(delayedHandleRoutesMatchedResult);
        }
    }

    // Navigate to the initial route
    navigate(window.location.pathname);
    return router;
}

/**
 * Create a router
 * @param {RouterConfig} config The router configuration
 * @returns The root router element
 * 
 * using {@link RouterConfig}
 * 
 * @example
 * createRouter({
 *    routes: [
 *        { 
 *            path: '/', component: () => <Layout />,
 *            children: [
 *                { index: true, component: () => <Navigate to="/categories" />, memo: false },
 *                { path: '/categories', component: Categories },
 *                { path: '/recipes', component: Recipes, memo: false },
 *                { path: '/recipe/:id', component: Recipe }
 *            ]
 *        }
 *    ]
 * });
 */
function createRouter(config: RouterConfig): VirtualElement {
    
    const renderedRoot = getRenderedRoot();
    if (!renderedRoot) {
        throw new Error('Out of a root context');
    }
    const router = buildRouter(config, renderedRoot);
    if (!config.ignoreRouterLink) {
        overrideNativeNavigation(router.container, router);
    }
    const rootRouterElement: VirtualElement = createElement(router.container, {});
    return rootRouterElement;
}

function overrideNativeNavigation(rootRouterElement: HTMLElement, router: Router) {
    rootRouterElement.addEventListener('click', (event) => {
        const target = (event.target as HTMLElement).closest('a');
        if (target && target.tagName === 'A' && target.hasAttribute('href') && target.hasAttribute('router-link')) {
            event.preventDefault();
            const href = target.getAttribute('href');
            if (href) {
                router.push(href);
            }
        }
    });
}

function applyViewTransition(updateDom: () => void) {
    if ('startViewTransition' in document && typeof document.startViewTransition === 'function') {
        document.startViewTransition(() => updateDom());
    } else {
        updateDom();
    }
}

export { createRouter, getRouter, getParams };