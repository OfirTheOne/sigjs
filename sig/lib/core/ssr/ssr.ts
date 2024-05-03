import { VirtualElement, VirtualElementChild, ELEMENT_TYPE } from "@/types";
import { ElementKeySymbol, SSRSymbol } from "@/symbols";
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { isNodeHTMLElement } from "@/core/utils";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { DOM } from "../html/html";
import { parseHtml } from "./parse-html";
import { fetchHtml } from "./fetch-html";
import { getSignalValue, listen, isSignal } from "../signal/signal.utils";
import type { SSRFetch } from "./ssr.types";
import type { RenderFunction } from "../dom-render/render";
import type { RootElementWithMetadata } from "../dom-render/create-root";
import type { Signal } from "../signal/signal.types";

customElements.define('ssr-ph', class extends HTMLElement { });
customElements.define('sig-outlet', class extends HTMLElement { });

interface SSRProps {
    fetch: SSRFetch;
    allowOutlet?: boolean;
    fallback?: VirtualElement;
    errorElement?: VirtualElement;
    onError?: (error: Error) => void;
    memo?: boolean | { key: string };
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
    render: RenderFunction,
    key: KeyBuilder
): HTMLElement | Text {
    const {
        fetch: urlOrHandlerOrFetchConfig,
        allowOutlet = true,
        fallback,
        children = [],
        errorElement,
        onError
    } = (element.props as unknown as SSRProps & { children: VirtualElement[] });
    const root = getRenderedRoot();
    const currentKey = key.clone().push(element.type);
    let fallbackDom: HTMLElement | Text | null = null;
    let prevSSRDom: HTMLElement | Text | null = null;
    let prevChildrenDom: ChildNode[] | null = null;
    const placeholderElm = DOM.createElement('ssr-ph', currentKey);
    if (fallback) {
        const fallbackKey = currentKey.clone().push('ssr-fallback');
        fallbackDom = render(fallback, container, fallbackKey);
        container.appendChild(fallbackDom);
    } else {
        container.appendChild(placeholderElm);
    }

    function injectResolvedDom(dom: HTMLElement | Text) {
        if (fallbackDom) {
            if (fallbackDom.parentElement !== container) {
                container.appendChild(dom);
            } else {
                container.replaceChild(dom, fallbackDom);
            }
        } else {
            container.replaceChild(dom, placeholderElm);
        }
    }
    function renderChildren(): ChildNode[] {
        const outletKey =  currentKey.clone().push('outlet')
        const outlet = DOM.createElement('sig-outlet', outletKey);
        render(children, outlet, outletKey);
        return Array.from(outlet.childNodes);
    }

    if (typeof urlOrHandlerOrFetchConfig === 'string' || (!isSignal(urlOrHandlerOrFetchConfig) && typeof urlOrHandlerOrFetchConfig === 'function')) {
        const fetchHtmlPromise = typeof urlOrHandlerOrFetchConfig === 'string'
            ? fetchHtml(urlOrHandlerOrFetchConfig, root)
            : urlOrHandlerOrFetchConfig() as Promise<string>;
        asyncRenderSSR(
            fetchHtmlPromise,
            root,
            render,
            renderChildren,
            { errorElement, onError, allowOutlet },
            injectResolvedDom,
            currentKey
        );
    } else {
        const renderListener = () => {
            const fetchHtmlPromise = isSignal(urlOrHandlerOrFetchConfig) ?
                fetchHtml(getSignalValue(urlOrHandlerOrFetchConfig) as string, root) :
                fetchHtml({
                    url: getSignalValue(urlOrHandlerOrFetchConfig.url),
                    query: getSignalValue(urlOrHandlerOrFetchConfig.query),
                    params: getSignalValue(urlOrHandlerOrFetchConfig.params),
                    config: getSignalValue(urlOrHandlerOrFetchConfig.config),
                }, root);
            asyncRenderSSR(
                fetchHtmlPromise,
                root,
                render,
                () => {
                    if (prevChildrenDom) {
                        return prevChildrenDom;
                    }
                    prevChildrenDom = renderChildren();
                    return prevChildrenDom;
                },
                { errorElement, onError, allowOutlet },
                (dom: HTMLElement | Text) => {
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
        const signals = isSignal(urlOrHandlerOrFetchConfig) ? [urlOrHandlerOrFetchConfig] :
            Object.values(urlOrHandlerOrFetchConfig).filter(isSignal) as Signal<unknown>[];

        listen(renderListener, signals);
        renderListener();
    }
    return fallbackDom || placeholderElm;
}

function asyncRenderSSR(
    provideHtmlPromise: Promise<string>,
    root: RootElementWithMetadata,
    render: RenderFunction,
    renderChildren: () => ChildNode[],
    props: Omit<SSRProps, 'fetch'>,
    injectResolvedDom: (dom: HTMLElement | Text) => void,
    key: KeyBuilder
) {
    const { errorElement, onError, allowOutlet } = props;
    return provideHtmlPromise.then((htmlString) => {
        setRenderedRoot(root.id);
        const htmlDom = parseHtml(htmlString);
        if (isNodeHTMLElement(htmlDom) && allowOutlet) {
            const outlet = htmlDom.querySelector('sig-outlet');
            if (outlet) {
                const outletKey = key.clone().push('ssr-outlet');
                const domChildren = renderChildren();
                domChildren.forEach((node, i) => {
                    node[ElementKeySymbol] = outletKey.clone().pushIndex(i);
                });
                outlet.replaceWith(...domChildren);
            }
        }
        injectResolvedDom(htmlDom);
    }).catch((error) => {
        setRenderedRoot(root.id);
        onError?.(error);
        if (!errorElement) {
            return;
        }
        const errorDom = render(errorElement, undefined, key);
        injectResolvedDom(errorDom);
    });
}

export type { SSRProps };
export { SSR, renderSSR };

