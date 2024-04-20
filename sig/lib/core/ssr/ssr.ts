

import { VirtualElement, VirtualElementChild, ELEMENT_TYPE } from "@/types";
import { SSRSymbol } from "@/symbols";
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { isNodeHTMLElement, isNodeText } from "@/core/utils";
import { RenderFunction } from "../dom-render/render";

customElements.define('ssr-ph', class extends HTMLElement { });
customElements.define('sig-outlet', class extends HTMLElement { });

interface SSRProps {
    url: string;
    fetchHandler?: () => Promise<string>;
    memo?: boolean | { key: string };
    allowOutlet?: boolean;
    fallback?: VirtualElement;
    errorElement?: VirtualElement;
    onError?: (error: Error) => void;
}

function SSR(props: SSRProps, children: VirtualElementChild[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.SSR,
        props: {
            children,
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

    const { url, fetchHandler, allowOutlet = true, fallback, children = [], errorElement, onError } = (
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
    Promise.resolve(provideHtml(url as string, fetchHandler))
        .then((htmlString) => {
            setRenderedRoot(root.id);
            const htmlDom = processSSRHtml(htmlString);
            if(isNodeHTMLElement(htmlDom) && allowOutlet) {
                const outlet = htmlDom.querySelector('sig-outlet');
                if(outlet) {
                    render(children, outlet as HTMLElement);
                    const domChildren = Array.from(outlet.childNodes);
                    outlet.replaceWith(...domChildren);                   
                }
            }
            if(fallbackDom) {
                if(fallbackDom.parentElement !== container) {
                    container.appendChild(htmlDom);
                } else {
                    container.replaceChild(htmlDom, fallbackDom);
                }
            } else {
                container.replaceChild(htmlDom, placeholderElm);
            }
        })
        .catch((error) => {
            setRenderedRoot(root.id);
            if(onError) {
                onError(error);
            }
            if(!errorElement) {
                return;
            }
            const errorDom = render(errorElement);
            if(fallbackDom) {
                if(fallbackDom.parentElement !== container) {
                    container.appendChild(errorDom);
                } else {
                    container.replaceChild(errorDom, fallbackDom);
                }
            } else {
                container.replaceChild(errorDom, placeholderElm);
            }
        });
    return fallbackDom || placeholderElm;

}

async function provideHtml(url: string, fetchHandler?: () => Promise<string>): Promise<string> {
    try {
        if(fetchHandler) {
            return await fetchHandler();
        }
        return await fetchSSRHtml(url);
    } catch (error) {
        throw new Error(`Failed to fetch SSR HTML: ${(<Error>error)?.message}`);
    }
}
async function fetchSSRHtml(url: string): Promise<string> {
    const res = await fetch(url);
    return await res.text();
}
function processSSRHtml(html: string): HTMLElement | Text {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const processedDom = dom.body.firstChild;
    if(!processedDom) {
        throw new Error('Invalid SSR HTML');
    }
    if(isNodeHTMLElement(processedDom) || isNodeText(processedDom)){
        return processedDom;
    }
    throw new Error('Processed SSR HTML is not a valid node');
}

export type { SSRProps };
export { SSR, renderSSR };