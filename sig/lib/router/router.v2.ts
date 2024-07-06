
import { uniqueId } from "@/common/unique-id";
import { render } from '@/core/dom-render/render/core-render';
import { getRenderedRoot } from "@/core/global";
import { createElement } from "@/jsx";
import { DOM } from "@/core/html";
import { isPromise } from "@/common/is-promise";
import logger from "@/common/logger/logger";
import { matchRoute } from "./nested-match-route";
import { KeyBuilder, keyBuilder } from "@/common/key-builder/key-builder";
import type { RootElementWithMetadata } from "@/core/dom-render/create-root";
import type { VirtualElement } from "@/types";
import type { Router, RouterConfig, RouteCommonConfig, RouteSyncConfig, RouteConfig } from "./router.type";
import { getActiveContext } from "@/core/dom-render/component-context/component-context";

const routersStore: Record<string, Router> = {};

customElements.define('app-router', class extends HTMLElement { });

customElements.define('router-outlet', class extends HTMLElement { });

const history = window.history;

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
            children: route.children ? appendIdToAllRouteTree(route.children) : route.children
        }
    });
}

function buildRouter(config: RouterConfig, renderedRoot: RootElementWithMetadata): Router {
    const { routes, base = '', onNoMatch, useViewTransition = true } = config;
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    const renderKey = keyBuilder(context.key).push(`router:${renderedRoot.id}`);
    const redirectStack: Parameters<typeof push>[] = [];
    const routesWithId = appendIdToAllRouteTree(routes);
    // const routesWithId = routes.map(route => {
    //     return {
    //         ...route,
    //         id: route.id ? route.id : uniqueId()
    //     }
    // });
    const routerElement = DOM.createElement('app-router', renderKey);

    const memoRenderedRoute: Record<string, HTMLElement | Text | ChildNode[]> = {};

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
        if (router.navigateState.isNavigating) {
            logger.warn('Router is currently navigating');
            redirectStack.push([path, state]);
            return;
        }
        history.pushState(state, "", path);
        navigate(window.location.pathname);
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

        const delayedHandleRoutesMatchedResult = () => {
            handleRoutesMatchedResult(
                router,
                routes,
                params,
                path,
                base,
                memoRenderedRoute,
                renderKey
            ).then((componentDom) => {
                if (componentDom) updateDom(componentDom);

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

        function updateDom(componentDom: HTMLElement | Text | ChildNode[]) {
            router.container.innerHTML = '';
            DOM.appendChild(router.container, componentDom);
        }
    }

    // Navigate to the initial route
    navigate(window.location.pathname);
    return router;
}

function renderMatch(
    router: Router,
    route: RouteCommonConfig & RouteSyncConfig,
    params: Record<string, string>,
    _path: string,
    memoRenderedRoute: Record<string, HTMLElement | Text | ChildNode[]>,
    routerRenderKey: KeyBuilder,
    container: HTMLElement
) {
    const routeId = route.id + (params ? JSON.stringify(params) : '');
    // if (router.matchedRouteId === routeId) return;
    // Route is about to change
 
    router.matchedRouteId = routeId;
    const routeSync = route as RouteCommonConfig & RouteSyncConfig;
    let componentDom: HTMLElement | Text | ChildNode[];  
    if (route.memo !== false && memoRenderedRoute[routeId]) {
        componentDom = memoRenderedRoute[routeId];
        emptyOutComponentOutlet(componentDom);
    } else {
        const componentVirtualElement = createElement(routeSync.component, {});
        componentDom = render(componentVirtualElement, container, routerRenderKey.push(routeId));
        memoRenderedRoute[routeId] = componentDom;
    }
    return componentDom as HTMLElement | Text | ChildNode[];
}

function emptyOutComponentOutlet(componentDom: HTMLElement | Text | ChildNode[]) {
    if(componentDom instanceof Element) {
        const outlet = componentDom.querySelector('router-outlet');
        if(outlet) {
            console.log('emptyOutComponentOutlet');
            outlet.innerHTML = '';
        }
    } else if(Array.isArray(componentDom)) {
        componentDom.forEach(node => {
            if(node instanceof Element) {
                const outlet = node.querySelector('router-outlet');
                if(outlet) {
                    console.log('emptyOutComponentOutlet');
                    outlet.innerHTML = '';
                }
            }
        })
    }
}



async function handleRoutesMatchedResult(
    router: Router,
    routes: RouteConfig[],
    params: Record<string, string>,
    path: string,
    _base: string,
    memoRenderedRoute: Record<string, HTMLElement | Text | ChildNode[]>,
    renderKey: KeyBuilder
) {
    let rootComponentDom: HTMLElement | Text | ChildNode[] | undefined | null = null;
    let componentDom: HTMLElement | Text | ChildNode[] | undefined;
    for (const [index, route] of routes.entries()) {
        const currentRouteRenderKey = renderKey.clone();
        const prevComponentDom = componentDom;
        const shouldEnterFunction = route.shouldEnter || function shouldEnterTrue() { return true; }
        let shouldEnterResult: boolean | Promise<boolean>;
        try {
            shouldEnterResult = shouldEnterFunction(path, params, history.state, router);
        } catch (error) {
            logger.warn(`Route ${route.path} throws an error on shouldEnter, instead of returning a boolean, prefer handling the error and return false.`);
            shouldEnterResult = false;
        }

        router.navigateState = {
            isNavigating: true,
        };
        let actualShouldEnterResult = false;
        if (isPromise<boolean>(shouldEnterResult)) {
            try {
                actualShouldEnterResult = await shouldEnterResult;
            } catch (error) {
                logger.warn(`Route ${route.path} should not enter`);
                actualShouldEnterResult = false;
            }
        } else {
            actualShouldEnterResult = shouldEnterResult;
        }
        router.navigateState.isNavigating = false;
        if (!actualShouldEnterResult) {
            logger.warn(`Route ${route.path} should not enter`);
            break;
        }

        let componentContainer: HTMLElement | null = null;
        if(index === 0) {
            componentContainer = router.container;
        } else if(prevComponentDom && prevComponentDom instanceof HTMLElement) {
            componentContainer = prevComponentDom.querySelector('router-outlet');
            if(!componentContainer && prevComponentDom.tagName === 'ROUTER-OUTLET') {
                componentContainer = prevComponentDom;
            }
        }

        const defaultContainer 
            = componentContainer 
            || DOM.createElement('router-outlet', currentRouteRenderKey.clone().push('router-outlet'));

        componentDom = renderMatch(
            router,
            route,
            params,
            path,
            memoRenderedRoute,
            currentRouteRenderKey,
            defaultContainer
        );

        if (rootComponentDom === null) {
            rootComponentDom = componentDom;
        } 

        if(componentDom && componentContainer) {
            componentContainer.innerHTML = '';
            DOM.appendChild(componentContainer, componentDom);
        }
    }

    return rootComponentDom;
}

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