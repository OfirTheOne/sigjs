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
): void {
    const { list, factory } = (element.props as unknown as ForProps);
    const placeholder = document.createElement('for-ph');
    container.appendChild(placeholder);
    const factoryFn = typeof factory === 'function' ? factory : () => factory;
    while (placeholder.lastChild) {
        placeholder.lastChild.remove();
    }
    if (!isSignal<Array<unknown>>(list)) {
        const elements = list.map(factoryFn);
        elements.forEach(element => render(element, placeholder));
    } else {
        const listSignal = list;
        listSignal.subscribe((list) => {
            while (placeholder.lastChild) {
                placeholder.lastChild.remove();
            }
            const elements = list.map(factoryFn);
            elements.forEach(element => render(element, placeholder));
        });
    }
}

export type { ForProps };
export { For, renderFor };