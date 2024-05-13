import { createElement } from "@/jsx";
import type { RenderFunction } from "@/core/dom-render/render";
import { VirtualElement, VirtualElementChild, ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/types";
import { isSignal, Signal, subscribeSignal } from "@/core/signal";
import { ForControlFlow } from "@/symbols";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";


interface ForProps<T = unknown> {
    list: Array<T> | Signal<Array<T>>;
    factory: VirtualElementChild | ((item: T) => VirtualElementChild);
    index?: string | ((item: T, i: number) => string);
    empty?: VirtualElementChild;
    as?: string;
    asProps?: { [key: string]: unknown };
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
    render: RenderFunction,
    key: KeyBuilder
): HTMLElement | Text {
    const { list, factory, index, as, asProps = {}, empty } = (element.props as unknown as ForProps);
    const currentKey = key.clone().push(element.props.controlTag as string);
    const placeholderDom = (as ? 
        render(createElement(as, { ...asProps, role: 'for-ph' }), undefined, key) :
        DOM.createElement('for-ph', currentKey)) as HTMLElement;
    
    const factoryFn = typeof factory === 'function' ? factory : () => factory;
    const indexFn = typeof index === 'function' ? index : ((item: unknown, i: number) => {
        if (typeof index === 'undefined') return String(i);
        return item?.[index as string] as string;
    });
    const indexItems = new Map<string, {
        dom: HTMLElement | Text;
    }>();
    while (placeholderDom.lastChild) {
        placeholderDom.lastChild.remove();
    }
    if (!isSignal<Array<unknown>>(list)) {  
        const childElements = list.map(factoryFn).map(adaptVirtualElementChild);
        childElements.forEach(childElement => render(childElement, placeholderDom, key));
    } else {
        const listSignal = list;
        placeholderDom.setAttribute('signal', listSignal.id);
        const unsubscribe = subscribeSignal(listSignal, (list) => {
            if(list.length === 0) {
                if(empty !== undefined) {
                    render(adaptVirtualElementChild(empty), placeholderDom, key);
                }
            }
            while (placeholderDom.lastChild) {
                placeholderDom.lastChild.remove();
            }
            const elementsDom = list.map((item, i) => {
                const indexValue = indexFn(item, i);
                const indexItem = indexItems.get(indexValue);
                if (indexItem) {
                    return indexItem.dom;
                }
                const childKey = key.clone().pushIndex(i);
                const element = adaptVirtualElementChild(factoryFn(item));
                const elementDom = render(element, placeholderDom, childKey);
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