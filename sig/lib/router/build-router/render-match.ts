
import { render } from '@/core/dom-render/render/core-render';
import { createElement } from "@/jsx";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import type { Router, RouteCommonConfig, RouteSyncConfig } from "../router.type";


function emptyOutComponentOutlet(componentDom: HTMLElement | Text | ChildNode[]) {
    if(componentDom instanceof Element) {
        const outlet = componentDom.querySelector('router-outlet');
        if(outlet) {
            outlet.innerHTML = '';
        }
    } else if(Array.isArray(componentDom)) {
        componentDom.forEach(node => {
            if(node instanceof Element) {
                const outlet = node.querySelector('router-outlet');
                if(outlet) {
                    outlet.innerHTML = '';
                }
            }
        });
    }
}

export function renderMatch(
    router: Router,
    route: RouteCommonConfig & RouteSyncConfig,
    params: Record<string, string>,
    _path: string,
    memoRenderedRoute: Record<string, HTMLElement | Text | ChildNode[]>,
    routerRenderKey: KeyBuilder,
    container: HTMLElement
): {
    routeId: string;
    componentDom: HTMLElement | Text | ChildNode[];
    memo: boolean;
} {
    const routeId = route.id + (params ? JSON.stringify(params) : '');
    // Route is about to change
 
    router.matchedRouteId = routeId;
    const routeSync = route as RouteCommonConfig & RouteSyncConfig;
    let componentDom: HTMLElement | Text | ChildNode[];  
    if (route.memo !== false && memoRenderedRoute[routeId]) {
        componentDom = memoRenderedRoute[routeId];
        emptyOutComponentOutlet(componentDom);
        return {
            routeId,
            componentDom,
            memo: true
        };
    } else {
        const componentVirtualElement = createElement(routeSync.component, {});
        componentDom = render(componentVirtualElement, container, routerRenderKey.push(routeId));
        memoRenderedRoute[routeId] = componentDom;
        return {
            routeId,
            componentDom,
            memo: false
        };
    }
}
