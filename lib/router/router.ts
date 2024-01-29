import { isPromise } from "@/common/is-promise";
import { uniqueId } from "@/common/uniqu-id";
import { element, render } from '@/core';
import { getRenderedRoot } from "@/core/global";
import type { RootElementWithMetadata } from "@/core/dom-render/create-root";
import type { AsyncComponentFunction, ComponentFunction, VirtualElement } from "@/types";

const routersStore: Record<string, Router> = {}

type RouteCommonConfig = {
    path: string;
    id?: string;
    onEnter?: () => void;
};

type RouteAsyncConfig = {
    component: AsyncComponentFunction;
    fallback?: ComponentFunction;
    loading?: ComponentFunction;
};
type RouteSyncConfig = {
    component: ComponentFunction;
};

type RouteConfig = RouteCommonConfig & (RouteAsyncConfig | RouteSyncConfig);

type RouterConfig = {
    routes: RouteConfig[];
    base?: string;
    onNoMatch?: () => void;
};

type Router = {
    rootId: string;
    routerElement: HTMLElement;
    navigate: (path: string) => void;
    state: Record<string, unknown>;
    push: (path: string | URL, state?: Record<string, unknown>) => void
    matchedRouteId: string;
};

customElements.define('app-router', class extends HTMLElement {})


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

function buildRouter(config: RouterConfig, renderedRoot: RootElementWithMetadata): Router {
    const { routes, base = '', onNoMatch } = config;
    const routesWithId = routes.map(route => {
        return {
            ...route,
            id: route.id ? route.id : uniqueId()
        }
    });
    const routerElement = document.createElement('app-router');

    const memoRenderedRoute: Record<string, HTMLElement | Text> = {};

    // Listen for changes in the URL
    window.addEventListener('popstate', (event) => {
        console.log(event.state);
        navigate(window.location.pathname);
    });

    const router: Router = {
        rootId: renderedRoot.id,
        routerElement,
        push,
        navigate,
        get state() { return window.history.state; },
        matchedRouteId: '',
    };
    routersStore[router.rootId] = router;

    function push(path: string | URL, state?: Record<string, unknown>) {
        window.history.pushState(state, "", path);
        navigate(window.location.pathname);
    }

    function navigate(path: string) {
        // Find the route that matches the path
        const route = routesWithId.find(route => base + route.path === path);

        if (!route) {
            if(onNoMatch) {
                onNoMatch();
            }
            console.error(`No route found for path ${path}`);
            return;
        }
        if(router.matchedRouteId === route.id) return;
        router.matchedRouteId = route.id;

        const componentElementOrPromise = route.component();
        if(isPromise(componentElementOrPromise)) {
            const routeAsync = route as RouteCommonConfig & RouteAsyncConfig;
            // Show loading component
            if (routeAsync.loading) {
                const loadingComponent = routeAsync.loading();
                const loadingDom = render(loadingComponent, routerElement);
                routerElement.appendChild(loadingDom);
                if(routeAsync.onEnter) routeAsync.onEnter();
            }
            if(!memoRenderedRoute[routeAsync.id]) {
                componentElementOrPromise.then(componentElement => {
                    // Remove loading component
                    routerElement.innerHTML = '';
                    const componentDom = render(componentElement, routerElement);
                    memoRenderedRoute[routeAsync.id] = componentDom;
                    routerElement.appendChild(componentDom); 
                }).catch(() => {
                    // If loading the component fails, load the fallback component if it exists
                    if (routeAsync.fallback) {
                        // Render the fallback component
                        const fallbackComponent = routeAsync.fallback();
                        const fallbackDom = render(fallbackComponent, routerElement);
                        routerElement.appendChild(fallbackDom);
                    }
                });
            } else {
                routerElement.appendChild(memoRenderedRoute[routeAsync.id]);
            }
        } else {
            routerElement.innerHTML = '';
            const routeSync = route as RouteCommonConfig & RouteSyncConfig;
            if(!memoRenderedRoute[routeSync.id]) {
                const componentElement = routeSync.component();
                const componentDom = render(componentElement, routerElement);
                memoRenderedRoute[routeSync.id] = componentDom;
                routerElement.appendChild(componentDom);
            } else {
                routerElement.appendChild(memoRenderedRoute[routeSync.id]);
            }
            if(routeSync.onEnter) routeSync.onEnter();
        }   
    }

    // Navigate to the initial route
    navigate(window.location.pathname);
    return router;
}



function createRouter(config: RouterConfig): VirtualElement {
    return element(() => { 
        const renderedRoot = getRenderedRoot();
        if (!renderedRoot) {
            throw new Error('Out of a root context');
        }
        const router = buildRouter(config, renderedRoot);
        return element(router.routerElement)
    });
}

export { createRouter, getRouter };