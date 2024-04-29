import { VirtualElement, VirtualElementChild, ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/types";
import { isSignal, Signal, subscribeSignal } from "@/core/signal";
import { ForControlFlow } from "@/symbols";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";

type RenderFunction = (
    element: VirtualElement,
    container: HTMLElement,
) => HTMLElement | Text;

interface ForProps<T = unknown> {
    list: Array<T> | Signal<Array<T>>;
    factory: VirtualElementChild | ((item: T) => VirtualElementChild);
    index?: string | ((item: T, i: number) => string);
}

function For<T = unknown>(props: ForProps<T>): VirtualElement {
    return {
        type: ELEMENT_TYPE.CONTROL_FLOW,
        props: {
            children: [],
            ...props,
            controlTag: CONTROL_FLOW_TAG.FOR,
        }
    };
}

For['$$type'] = ForControlFlow;

customElements.define('for-ph', class extends HTMLElement { });

function renderFor(
    element: VirtualElement,
    _container: HTMLElement,
    render: RenderFunction
): HTMLElement | Text {
    const { list, factory, index } = (element.props as unknown as ForProps);
    const placeholderDom = document.createElement('for-ph');
    const factoryFn = typeof factory === 'function' ? factory : () => factory;
    const indexFn = typeof index === 'function' ? index : ((item: unknown, i: number) => {
        if (typeof index === 'undefined') return String(i);
        return item?.[index as string] as string;

    });
    const indexItems = new Map<string, {
        dom: HTMLElement | Text;
    }>()
    while (placeholderDom.lastChild) {
        placeholderDom.lastChild.remove();
    }
    if (!isSignal<Array<unknown>>(list)) {
        const childElements = list.map(factoryFn);
        childElements.forEach(childElement => render(childElement, placeholderDom));
    } else {
        const listSignal = list;
        placeholderDom.setAttribute('signal', listSignal.id);
        const unsubscribe = subscribeSignal(listSignal, (list) => {
            while (placeholderDom.lastChild) {
                placeholderDom.lastChild.remove();
            }
            const elementsDom = list.map((item, i) => {
                const indexValue = indexFn(item, i);
                const indexItem = indexItems.get(indexValue);
                if (indexItem) {
                    return indexItem.dom;
                }
                const element = factoryFn(item);
                const elementDom = render(element, placeholderDom);
                indexItems.set(indexValue, { dom: elementDom });
                return elementDom;
            });
            elementsDom.forEach(elementDom => {
                placeholderDom.appendChild(elementDom);
            });
        });

        registerSignalSubscription(placeholderDom, unsubscribe);
    }
    return placeholderDom;
}

export type { ForProps };
export { For, renderFor };