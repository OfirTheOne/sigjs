import { VirtualElement, VirtualElementChild, ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/types";
import { isSignal, Signal } from "@/signal";

interface ForProps<T = unknown> {
    list: Array<T> | Signal<Array<T>>;
    factory: VirtualElementChild | ((item: T) => VirtualElementChild);
    index?: string | ((item: T) => string);
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

customElements.define('for-ph', class extends HTMLElement {});

function renderFor(
    element: VirtualElement, 
    container: HTMLElement, 
    render: ((element: VirtualElement, container: HTMLElement) => unknown)
): HTMLElement | Text {
    const { list, factory } = (element.props as unknown as ForProps);
    const placeholderDom = document.createElement('for-ph');
    container.appendChild(placeholderDom);
    const factoryFn = typeof factory === 'function' ? factory : () => factory;
    // const indexItems = new Map<string, >()
    while (placeholderDom.lastChild) {
        placeholderDom.lastChild.remove();
    }
    if (!isSignal<Array<unknown>>(list)) {
        const elements = list.map(factoryFn);
        elements.forEach(element => render(element, placeholderDom));
    } else {
        const listSignal = list;
        listSignal.subscribe((list) => {
            while (placeholderDom.lastChild) {
                placeholderDom.lastChild.remove();
            }
            const elements = list.map(factoryFn);
            elements.forEach(element => render(element, placeholderDom));
        });
    }
    return container;
}

export type { ForProps };
export { For, renderFor };