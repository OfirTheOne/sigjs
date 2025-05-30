
import { DOM } from "@/core/html";
import { isPromise } from "@/common/is-promise";
import logger from "@/common/logger/logger";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { createElement } from "@/jsx";
import { render } from '@/core/dom-render/render/core-render';
import type { RouteComponentProps, Router, RouteConfig, RouterPushParameters, ShouldEnterCallback } from "../router.type";

export async function handleRoutesMatchedResult(
    router: Router,
    routes: RouteConfig[],
    params: Record<string, string>,
    path: string,
    _base: string,
    memoRenderedRoute: Record<string, HTMLElement | Text | ChildNode[]>,
    renderKey: KeyBuilder,
    onRouteChange: () => void
) {
    let rootComponentDom: HTMLElement | Text | ChildNode[] | undefined | null = null;
    let componentDom: HTMLElement | Text | ChildNode[] | undefined;
    const renderedComponentList: {
        routeId: string;
        componentDom: HTMLElement | Text | ChildNode[];
        componentContainer: HTMLElement | null;
        memo: boolean;
    }[] = [];

    for (const [index, route] of routes.entries()) {
        const currentRouteRenderKey = renderKey.clone();
        const prevComponentDom = componentDom;
        const actualShouldEnterResult = await runShouldEnterStage(router, route, path, params);

        // Enforce the shouldEnter result 
        //  - stop the rendering process if the result is not true
        //  - if the result is an object, navigate to the path 
        if (actualShouldEnterResult != true) {
            logger.warn(`Route ${'path' in route ? route.path : route.id} should not enter`);
            if (actualShouldEnterResult && 'path' in actualShouldEnterResult) {
                const { path, state } = actualShouldEnterResult;
                setTimeout(() => router.push(path, state));
            }
            break;
        }

        const routeId = route.id + (params ? JSON.stringify(params) : '');
        const componentContainer: HTMLElement | null = buildRouteContainer(
            router,
            index,
            prevComponentDom,
            currentRouteRenderKey
        );

        let renderMatchResult: {
            routeId: string,
            componentDom: HTMLElement | Text | ChildNode[],
            memo: boolean
        };

        router.matchedRouteId = routeId;
        const routeSync = route;
        let currentComponentDom: HTMLElement | Text | ChildNode[];
        if (route.memo !== false && memoRenderedRoute[routeId]) {
            currentComponentDom = memoRenderedRoute[routeId];
            emptyOutComponentOutlet(currentComponentDom);
            renderMatchResult = {
                routeId,
                componentDom: currentComponentDom,
                memo: true
            };
        } else {
            const loaderResult = await runLoaderStage(route, params, path);
            const routeComponentProps: RouteComponentProps = {
                loaderResult,
                params,
                state: history.state
            };
            const componentVirtualElement = createElement(routeSync.component, routeComponentProps);
            currentComponentDom = render(componentVirtualElement, componentContainer, currentRouteRenderKey.push(routeId));
            if(currentComponentDom === componentContainer) {
                currentComponentDom = DOM.getChildNodes(componentContainer);
            }
            memoRenderedRoute[routeId] = currentComponentDom;
            renderMatchResult = {
                routeId,
                componentDom: currentComponentDom,
                memo: false
            };
        }

        const { memo: isMemo } = renderMatchResult;
        componentDom = renderMatchResult.componentDom;
        renderedComponentList.push({ routeId, componentDom, componentContainer, memo: isMemo });
        if (isMemo) {
            logger.log(`Route ${'path' in route ? route.path : route.id} is memoized`);
        }
        if (rootComponentDom === null) {
            rootComponentDom = componentDom;
        }
    }

    // let isFirstNonMemoComponentAttached = false;
    for (const {
        // memo, 
        componentDom: componentDomToRender,
        componentContainer
    } of renderedComponentList) {
        // (isFirstNonMemoComponentAttached || !memo) &&
        if (componentDomToRender && componentContainer) {
            // isFirstNonMemoComponentAttached = true;
            componentContainer.innerHTML = '';
            DOM.appendChild(componentContainer, componentDomToRender);
        }
    }
    if (renderedComponentList.length > 0) {
        onRouteChange();
    }
    return rootComponentDom;
}

function emptyOutComponentOutlet(componentDom: HTMLElement | Text | ChildNode[]) {
    if (componentDom instanceof Element) {
        const outlet = componentDom.querySelector('router-outlet');
        if (outlet) {
            outlet.innerHTML = '';
        }
    } else if (Array.isArray(componentDom)) {
        componentDom.forEach(node => {
            if (node instanceof Element) {
                const outlet = node.querySelector('router-outlet');
                if (outlet) {
                    outlet.innerHTML = '';
                }
            }
        });
    }
}

function buildRouteContainer(
    router: Router,
    index: number,
    prevComponentDom: HTMLElement | Text | ChildNode[] | undefined,
    currentRouteRenderKey: KeyBuilder
): HTMLElement {
    let componentContainer: HTMLElement | null = null;
    if (index === 0) {
        componentContainer = router.container;
    } else if (prevComponentDom && prevComponentDom instanceof HTMLElement) {
        componentContainer = prevComponentDom.querySelector('router-outlet');
        if (!componentContainer && prevComponentDom.tagName === 'ROUTER-OUTLET') {
            componentContainer = prevComponentDom;
        }
    }

    return componentContainer
        || DOM.createElement('router-outlet', currentRouteRenderKey.clone().push('router-outlet'));
} 

async function runShouldEnterStage(
    router: Router,
    route: RouteConfig,
    path: string,
    params: Record<string, string>,
): Promise<Awaited<ReturnType<ShouldEnterCallback>>> {
    const shouldEnterFunction = route.shouldEnter || function shouldEnterTrue() { return true; }
    let shouldEnterResult: ReturnType<ShouldEnterCallback>;
    router.navigateState = {
        isNavigating: true,
    };
    try {
        shouldEnterResult = shouldEnterFunction({ path, params, state: history.state, router });
    } catch (error) {
        logger.warn(`Route ${'path' in route ? route.path : route.id} throws an error on shouldEnter, instead of returning a boolean, prefer handling the error and return false.`);
        shouldEnterResult = false;
    }

    let actualShouldEnterResult: Awaited<ReturnType<ShouldEnterCallback>> = false;
    if (isPromise<boolean | RouterPushParameters>(shouldEnterResult)) {
        try {
            actualShouldEnterResult = await shouldEnterResult;
        } catch (error) {
            logger.warn(`Route ${'path' in route ? route.path : route.id} should not enter`);
            actualShouldEnterResult = false;
        }
    } else {
        actualShouldEnterResult = shouldEnterResult;
    }
    router.navigateState.isNavigating = false;
    return actualShouldEnterResult;
}

async function runLoaderStage(
    route: RouteConfig,
    params: Record<string, string>,
    path: string,
): Promise<unknown> {
    const loaderFunction = route.loader;
    if (loaderFunction) {
        const result = loaderFunction({ path, params, state: history.state });
        if (isPromise(result)) {
            try {
                return await result;
            } catch (error) {
                logger.warn(`Route ${path} throws an error on loader, instead of returning a component, prefer handling the error and return a component.`);
                return null;
            }
        } else {
            return result;
        }
    }
}