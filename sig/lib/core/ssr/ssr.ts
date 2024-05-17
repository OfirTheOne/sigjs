import { ELEMENT_TYPE } from "@/constants";
import { ElementKeySymbol, SSRSymbol } from "@/symbols";
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { isNodeElement } from "@/core/utils";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { groupBy } from "@/common/group-by";
import logger from "@/common/logger/logger";
import { DOM } from "../html/html";
import { parseHtml } from "./parse-html";
import { fetchHtml } from "./fetch-html";
import { getSignalValue, listen, isSignal } from "../signal/signal.utils";
import { adaptVirtualElementChild } from "../dom-render/create-element/adapt-virtual-element-child";
import type { VirtualElement, VirtualElementChild } from "@/types";
import type { SSRFetch } from "./ssr.types";
import type { RenderFunction } from "../dom-render/render";
import type { RootElementWithMetadata } from "../dom-render/create-root";
import type { Signal } from "../signal/signal.types";

customElements.define('ssr-ph', class extends HTMLElement { });
customElements.define('sig-outlet', class extends HTMLElement { });

interface SSRProps {
    fetch: SSRFetch;
    fallback?: VirtualElement;
    allowOutlet?: boolean;
    selector?: string;
    memo?: boolean | { key: string };
    rerun?: Signal<unknown>;
    rerunFallback?: VirtualElement;
    errorElement?: VirtualElement;
    onError?: (error: Error) => void;
}

function SSR(props: SSRProps, children: VirtualElementChild[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.SSR,
        props: {
            children: children || [],
            ...props,
        }
    };
}

SSR['$$type'] = SSRSymbol;

function renderSSR(
    element: VirtualElement,
    container: HTMLElement,
    key: KeyBuilder,
    render: RenderFunction,
): HTMLElement | Text {
    const {
        fetch: urlOrHandlerOrFetchConfig,
        allowOutlet = true,
        fallback,
        children = [],
        errorElement,
        onError,
        rerun,
        selector
    } = (element.props as unknown as SSRProps & { children: VirtualElement[] });
    const root = getRenderedRoot();
    const currentKey = key.clone().push(element.type);
    let fallbackDom: HTMLElement | Text | null = null;
    let prevSSRDom: Element | Text | null = null;
    const memoChildrenDom: Record<string, ChildNode[] | null> = {};

    const placeholderElm = DOM.createElement('ssr-ph', currentKey);
    const signals: Signal<unknown>[] = [];
    const isArgumentSignaled = (typeof urlOrHandlerOrFetchConfig === 'string' || (!isSignal(urlOrHandlerOrFetchConfig) && typeof urlOrHandlerOrFetchConfig === 'function'));

    if (fallback) {
        const fallbackKey = currentKey.clone().push('ssr-fallback');
        fallbackDom = render(fallback, container, fallbackKey);
        DOM.appendChild(container, fallbackDom);
    } else {
        DOM.appendChild(container, placeholderElm);
    }

    if (isArgumentSignaled) {
        signals.push(
            ...(isSignal(urlOrHandlerOrFetchConfig) ?
                [urlOrHandlerOrFetchConfig] :
                Object.values(urlOrHandlerOrFetchConfig).filter(isSignal) as Signal<unknown>[])
        );
    }
    if (rerun && isSignal(rerun)) {
        signals.push(rerun);
    }
    const renderListener = () => {
        let fetchHtmlPromise: Promise<string>;
        if (isArgumentSignaled) {
            fetchHtmlPromise = typeof urlOrHandlerOrFetchConfig === 'string'
                ? fetchHtml(urlOrHandlerOrFetchConfig, root)
                : urlOrHandlerOrFetchConfig() as Promise<string>;
        } else {
            fetchHtmlPromise = isSignal(urlOrHandlerOrFetchConfig) ?
                fetchHtml(getSignalValue(urlOrHandlerOrFetchConfig) as string, root) :
                fetchHtml({
                    url: getSignalValue(urlOrHandlerOrFetchConfig.url),
                    query: getSignalValue(urlOrHandlerOrFetchConfig.query),
                    params: getSignalValue(urlOrHandlerOrFetchConfig.params),
                    config: getSignalValue(urlOrHandlerOrFetchConfig.config),
                }, root);
        }

        asyncRenderSSR(
            fetchHtmlPromise,
            root,
            render,
            children,
            memoChildrenDom,
            { errorElement, onError, allowOutlet, selector },
            (dom: Element | Text) => {
                if (prevSSRDom) {
                    container.replaceChild(dom, prevSSRDom);
                } else {
                    injectResolvedDom(dom);
                }
                prevSSRDom = dom;
            },
            currentKey
        );
    };
    if (signals.length) {
        listen(renderListener, signals);
    }
    renderListener();
    return fallbackDom || placeholderElm;

    function injectResolvedDom(dom: Element | Text) {
        if (fallbackDom) {
            if (fallbackDom.isConnected) {
                container.replaceChild(dom, fallbackDom);
            } else {
                logger.warn('Fallback element is not connected to the DOM');
            }
        } else {
            if (placeholderElm.isConnected) {
                container.replaceChild(dom, placeholderElm);
            }
        }
    }
}

function asyncRenderSSR(
    provideHtmlPromise: Promise<string>,
    root: RootElementWithMetadata,
    render: RenderFunction,
    children: VirtualElementChild[],
    memoChildrenRecord: Record<string, ChildNode[] | null>,
    props: Omit<SSRProps, 'fetch'>,
    injectResolvedDom: (dom: Element | Text) => void,
    key: KeyBuilder
) {
    const { errorElement, onError, allowOutlet } = props;
    return provideHtmlPromise.then((htmlString) => {
        setRenderedRoot(root.id);
        const htmlDom = applySelector(parseHtml(htmlString), props.selector);
        if (!htmlDom) return;
        const ssrKey = 'tagName' in htmlDom ?
            key.clone().push(htmlDom.tagName.toLowerCase()) : key.clone();
        htmlDom[ElementKeySymbol] = ssrKey.toString();
        if (isNodeElement(htmlDom) && allowOutlet) {
            const virtualElementChildren = children.map(adaptVirtualElementChild);
            const unnamedChildren = virtualElementChildren.filter((child) => !child.props.name);
            if (unnamedChildren.length) {
                logger.warn('Unnamed children are not supported in SSR');
            }
            const namedChildren = groupBy(virtualElementChildren, (child) => (child.props.name || '') as string);
            
            for (const [outletName, child] of Object.entries(namedChildren)){ 
                const domOutlet = htmlDom.querySelector(`sig-outlet[name="${outletName}"]`);
                if(!domOutlet) continue;
                if(memoChildrenRecord[outletName]) {
                    const memoChildren = memoChildrenRecord[outletName] || [];
                    domOutlet.replaceChildren(...memoChildren);
                    continue;
                }
                const outletKey = key.clone().push('ssr-outlet').push(outletName);
                render(child, domOutlet as HTMLElement, outletKey);
                const domChildren = Array.from(domOutlet.childNodes);
                memoChildrenRecord[outletName] = domChildren;
                domChildren.forEach((node, i) => {
                    node[ElementKeySymbol] = outletKey.clone().pushIndex(i);
                });
            }
        }
        injectResolvedDom(htmlDom);
    }).catch((error) => {
        setRenderedRoot(root.id);
        onError?.(error);
        if (!errorElement) return;
        const errorDom = render(errorElement, undefined, key);
        injectResolvedDom(errorDom);
    });
}

function applySelector(dom: Element | Text, selector?: string): Element | Text | null {
    if (dom instanceof Text || !selector) {
        return dom;
    }
    return dom.querySelector(selector);
}

export type { SSRProps };
export { SSR, renderSSR };