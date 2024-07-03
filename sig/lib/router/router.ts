
// import { isPromise } from "@/common/is-promise";
/*
import { uniqueId } from "@/common/unique-id";
import { render } from '@/core';
import { getRenderedRoot } from "@/core/global";
import { createElement } from "@/jsx";
import { DOM } from "@/core/html";
import { matchRoute } from "./match-route";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { isPromise } from "@/common/is-promise";
import logger from "@/common/logger/logger";
import type { RootElementWithMetadata } from "@/core/dom-render/create-root";
import type { VirtualElement } from "@/types";
import type { Router, RouterConfig, RouteCommonConfig, RouteSyncConfig } from "./router.type";

const routersStore: Record<string, Router> = {};

customElements.define('app-router', class extends HTMLElement {})

const history = window.history;



function getRouter(): Router {
    const renderedRootId = getRenderedRoot();
    if (!renderedRootId) {
        throw new Error('Out of a root context');
    }
    const router = routersStore[renderedRootId.id];
    if(!router) {
        throw new Error('No router found');
    }
    return router;
}

function getParams(): Record<string, string> {
    const router = getRouter();
    if(router.navigationMatchMetadata) {
        return router.navigationMatchMetadata.params || {};
    }
    return {};
}

function buildRouter(config: RouterConfig, renderedRoot: RootElementWithMetadata): Router {
    const { routes, base = '', onNoMatch, useViewTransition = true } = config;
    const routesWithId = routes.map(route => {
        return {
            ...route,
            id: route.id ? route.id : uniqueId()
        }
    });
    const routerElement = document.createElement('app-router');

    const memoRenderedRoute: Record<string, ChildNode[]> = {};

    // Listen for changes in the URL
    window.addEventListener('popstate', (event) => {
        console.log(event.state);
        navigate(window.location.pathname);
    });

    const router: Router = {
        navigateState: {
            isNavigating: false,
        },
        rootId: renderedRoot.id,
        container: routerElement,
        push,
        navigate,
        get state() { return history.state; },
        matchedRouteId: '',
    };
    routersStore[router.rootId] = router;

    function push(path: string | URL, state?: Record<string, unknown>) {
        if(router.navigateState.isNavigating) {
            logger.warn('Router is currently navigating');
            return;
        }
        history.pushState(state, "", path);
        navigate(window.location.pathname);
    }

    function navigate(path: string) {
        if(router.navigateState.isNavigating) {
            logger.warn('Router is currently navigating');
            return;
        }

        // Find the route that matches the path
        const matchResult = matchRoute(path, routesWithId, base);
        if (!matchResult) {
            if(onNoMatch) {
                onNoMatch();
            }
            logger.warn(`No route found for path ${path}`);
            return;
        }

        const { route, params } = matchResult;

        const shouldEnterFunction = route.shouldEnter || function shouldEnterTrue() { return true; }
        let shouldEnterResult: boolean | Promise<boolean>;
        try {
            shouldEnterResult = shouldEnterFunction(path, params, history.state, router);
        } catch (error) {
            shouldEnterResult = false;
        }
        if(isPromise<boolean>(shouldEnterResult)) {
            router.navigateState = {
                isNavigating: true,
                matchMetadata: { path, route, params }
            };
            shouldEnterResult
                .then((actualShouldEnterResult) => {
                    router.navigateState.isNavigating = false;
                    if(!actualShouldEnterResult) {
                        logger.warn(`Route ${route.path} should not enter`);
                        return;
                    }
                    applyMatching();
                })
                .catch(() => {
                    router.navigateState.isNavigating = false;
                    logger.warn(`Route ${route.path} should not enter`);
                    return;
                });
        } else {
            if(!shouldEnterResult) {
                logger.warn(`Route ${route.path} should not enter`);
                return;
            }
            applyMatching();
        }

        function applyMatching() {
            const routeId = route.id + (params ? JSON.stringify(params) : '');
            if(router.matchedRouteId === routeId) return;
            // Route is about to change
            if(router.navigationMatchMetadata) {
                const { route: prevRoute, params: prevParams = {} } = router.navigationMatchMetadata;
                if(prevRoute.onLeave) prevRoute.onLeave(prevParams);
                const preNavigateRouteElement = Array.from(router.container.childNodes);  
                memoRenderedRoute[router.matchedRouteId] = preNavigateRouteElement;
            }
    
            router.navigationMatchMetadata = {
                path,
                route,
                params
            };
            router.matchedRouteId = routeId;
    
            function updateDom() {
                router.container.innerHTML = '';
                const routeSync = route as RouteCommonConfig & RouteSyncConfig;
                const routeSyncId = routeId;
                if(!memoRenderedRoute[routeSyncId]) {
                    const componentElement = routeSync.component();    
                    const componentDom = render(adaptVirtualElementChild(componentElement), router.container);
                    DOM.appendChild(router.container, componentDom);
                } else {
                    DOM.appendChild(router.container, memoRenderedRoute[routeSyncId]);
                }
                if(routeSync.onEnter) routeSync.onEnter();
            }
    
            if(!useViewTransition) {
                updateDom();
            } else {
                applyViewTransition(updateDom);
            } 
        }
    }

    // Navigate to the initial route
    navigate(window.location.pathname);
    return router;
}

function createRouter(config: RouterConfig): VirtualElement {
    const renderedRoot = getRenderedRoot();
    if (!renderedRoot) {
        throw new Error('Out of a root context');
    }
    const router = buildRouter(config, renderedRoot);
    let rootRouterElement: VirtualElement;
    if(!config.ignoreRouterLink) {
        overrideNativeNavigation(router.container, router);
    }
    if(config.layout) {
        rootRouterElement = createElement(config.layout, {}, router.container);
    } else {
        rootRouterElement = createElement(router.container, {});
    }
    return rootRouterElement;
}

function overrideNativeNavigation(rootRouterElement: HTMLElement, router: Router) {
    rootRouterElement.addEventListener('click', (event) => {
        const target = (event.target as HTMLElement).closest('a');
        if(target && target.tagName === 'A' && target.hasAttribute('href') && target.hasAttribute('router-link'))  {
            event.preventDefault();
            const href = target.getAttribute('href');   
            if(href) {
                router.push(href);
            }
        }
    });
}

function applyViewTransition(updateDom: () => void) {
    if('startViewTransition' in document && typeof document.startViewTransition === 'function' ) {
        document.startViewTransition(() => updateDom());
    } else {
        updateDom();
    }
}
export { createRouter, getRouter, getParams };

*/