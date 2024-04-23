import { VirtualElement, VirtualElementChild, ELEMENT_TYPE } from "@/types";
import { SSRSymbol } from "@/symbols";
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { isNodeHTMLElement } from "@/core/utils";
import { parseHtml } from "./parse-html";
import { SSRFetch, SSRFetchOptions } from "./ssr.types";
import type { RenderFunction } from "../dom-render/render";
import type { RootElementWithMetadata } from "../dom-render/create-root";
import { Signal } from "../signal/signal.types";
import { getSignalValue, listen } from "../signal/signal.utils";
import { isSignal } from "../signal/signal.utils";
import { fetchHtml } from "./fetch-html";


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
    render: RenderFunction
): HTMLElement | Text {
    const { 
        fetch: urlOrHandlerOrFetchConfig, 
        allowOutlet = true, 
        fallback, 
        children = [], 
        errorElement,
         onError 
    } = (
        element.props as unknown as SSRProps & { children: VirtualElement[] });
    const root = getRenderedRoot();

    let fallbackDom: HTMLElement | Text | null = null;
    const placeholderElm = document.createElement('ssr-ph');
    if(fallback) {
        fallbackDom = render(fallback, container);
        container.appendChild(fallbackDom);
    } else {
        container.appendChild(placeholderElm);
    }

    function injectResolvedDom(dom: HTMLElement | Text) {
        if(fallbackDom) {
            if(fallbackDom.parentElement !== container) {
                container.appendChild(dom);
            } else {
                container.replaceChild(dom, fallbackDom);
            }
        } else {
            container.replaceChild(dom, placeholderElm);
        }
    }

    if(typeof urlOrHandlerOrFetchConfig === 'string') {
        asyncRenderSSR(
            fetchHtml(urlOrHandlerOrFetchConfig, root),
            root,
            render,
            children,
            errorElement,
            onError,
            allowOutlet,
            injectResolvedDom
        );
    } else if(typeof urlOrHandlerOrFetchConfig === 'function') {
        asyncRenderSSR(
            urlOrHandlerOrFetchConfig() as Promise<string>,
            root,
            render,
            children,
            errorElement,
            onError,
            allowOutlet,
            injectResolvedDom
        );   
    } else if(isSignal(urlOrHandlerOrFetchConfig)) {
        const renderListener = () => {
                const url = getSignalValue(urlOrHandlerOrFetchConfig) as string;
                asyncRenderSSR(
                    fetchHtml(url, root),
                    root,
                    render,
                    children,
                    errorElement,
                    onError,
                    allowOutlet,
                    injectResolvedDom
                );
            };
        listen(renderListener, [urlOrHandlerOrFetchConfig]);
        renderListener();
    } else {
        const signalFields = Object.values(urlOrHandlerOrFetchConfig).filter(isSignal) as Signal<unknown>[];
        const renderListener = () => {
            const nonSignalFetchOptions: SSRFetchOptions = {
                url: getSignalValue(urlOrHandlerOrFetchConfig.url),
                query: getSignalValue(urlOrHandlerOrFetchConfig.query),
                params: getSignalValue(urlOrHandlerOrFetchConfig.params),
                config: getSignalValue(urlOrHandlerOrFetchConfig.config),
            };
            asyncRenderSSR(
                fetchHtml(nonSignalFetchOptions, root),
                root,
                render,
                children,
                errorElement,
                onError,
                allowOutlet,
                injectResolvedDom
            );
        };
        listen(renderListener, signalFields);
        renderListener();
    }   
    return fallbackDom || placeholderElm;
}


function asyncRenderSSR(
    provideHtmlPromise: Promise<string>, 
    root: RootElementWithMetadata, 
    render: RenderFunction,
    children: VirtualElement[],
    errorElement: VirtualElement | undefined,
    onError: ((error: Error) => void) | undefined,
    allowOutlet: boolean,
    injectResolvedDom: (dom: HTMLElement | Text) => void,
) {
    return provideHtmlPromise.then((htmlString) => {
        setRenderedRoot(root.id);
        const htmlDom = parseHtml(htmlString);
        if(isNodeHTMLElement(htmlDom) && allowOutlet) {
            const outlet = htmlDom.querySelector('sig-outlet');
            if(outlet) {
                render(children, outlet as HTMLElement);
                const domChildren = Array.from(outlet.childNodes);
                outlet.replaceWith(...domChildren);                   
            }
        }
        injectResolvedDom(htmlDom);
    })
    .catch((error) => {
        setRenderedRoot(root.id);
        onError?.(error);
        if(!errorElement) {
            return;
        }
        const errorDom = render(errorElement);
        injectResolvedDom(errorDom);
    });
}


export type { SSRProps };
export { SSR, renderSSR };

