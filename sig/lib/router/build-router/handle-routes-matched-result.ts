
import { DOM } from "@/core/html";
import { isPromise } from "@/common/is-promise";
import logger from "@/common/logger/logger";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { renderMatch } from "./render-match";
import type { Router, RouteConfig, RouterPushParameters } from "../router.type";

export async function handleRoutesMatchedResult(
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
    const renderedComponentList: {
        routeId: string;
        componentDom: HTMLElement | Text | ChildNode[];
        componentContainer: HTMLElement | null;
        memo: boolean;
    }[] = [];

    for (const [index, route] of routes.entries()) {
        const currentRouteRenderKey = renderKey.clone();
        const prevComponentDom = componentDom;
        const shouldEnterFunction = route.shouldEnter || function shouldEnterTrue() { return true; }
        let shouldEnterResult: ReturnType<typeof shouldEnterFunction>;
        try {
            shouldEnterResult = shouldEnterFunction(path, params, history.state, router);
        } catch (error) {
            logger.warn(`Route ${route.path} throws an error on shouldEnter, instead of returning a boolean, prefer handling the error and return false.`);
            shouldEnterResult = false;
        }

        router.navigateState = {
            isNavigating: true,
        };
        let actualShouldEnterResult: Awaited<ReturnType<typeof shouldEnterFunction>> = false;
        if (isPromise<boolean | RouterPushParameters>(shouldEnterResult)) {
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
        if (actualShouldEnterResult != true) {
            logger.warn(`Route ${route.path} should not enter`);
            if (actualShouldEnterResult && 'path' in actualShouldEnterResult) {
                const { path, state } = actualShouldEnterResult;
                setTimeout(() => router.push(path, state));
            }
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

        const renderMatchResult = renderMatch(
            router,
            route,
            params,
            path,
            memoRenderedRoute,
            currentRouteRenderKey,
            defaultContainer
        );
        const { routeId, memo: isMemo } = renderMatchResult;
        componentDom = renderMatchResult.componentDom;
        renderedComponentList.push({ routeId, componentDom , componentContainer, memo: isMemo });
        if(isMemo) {
            logger.log(`Route ${route.path} is memoized`);
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
        if(componentDomToRender && componentContainer) {
            // isFirstNonMemoComponentAttached = true;
            componentContainer.innerHTML = '';
            DOM.appendChild(componentContainer, componentDomToRender);
        }
    }
    return rootComponentDom;
}
