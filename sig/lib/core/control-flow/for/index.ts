import { createElement } from "@/jsx";
import { ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/constants";
import { isSignal, Signal, subscribeSignal } from "@/core/signal";
import { ForControlFlow } from "@/symbols";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import type { RenderFunction } from "@/core/dom-render/render";
import type { VirtualElement, Renderable } from "@/types";

/**
 * For control flow element props
 * 
 * used in {@link For}
 * 
 */ 
interface ForProps<T = unknown> {
    /**
     * The list of items to iterate over
     */ 
    list: Array<T> | Signal<Array<T>>;
    /**
     * The factory function to create the elements
     */ 
    factory: Renderable | ((item: T, index: number, list: T[]) => Renderable);
    /**
     * The index of the item
     */
    index?: string | ((item: T, i: number) => string);
    /**
     * The element to render when the list is empty
     */
    empty?: Renderable;
    /**
     * The tag of the element to render
     * if not provided, it will render a custom element with the tag 'for-ph'
     */
    as?: string;
    /**
     * The props of the element to render
     */
    asProps?: { [key: string]: unknown };
}
/**
 * For control flow element
 * @param {ForProps} props - For control flow element props
 *
 * using {@link ForProps}
 * 
 * @category Control-Flow
 * 
 * @example
 *  <For 
 *      as='div'
 *      asProps={{ className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }} 
 *      list={recipes$}
 *      index={(recipe) => recipe.id}
 *      factory={(recipe) => <RecipeCard recipe={recipe} />}
 *  />
 */
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
        if (typeof index === 'undefined' || index === null) {
            return typeof item === 'object' ? String(i) : String(item);
        }
        return item?.[index as string] as string;
    });
    const indexItems = new Map<string, { dom: HTMLElement | Text; }>();
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
            DOM.removeAllChildren(placeholderDom);
            if(list.length === 0) {
                if(empty !== undefined) {
                    const emptyDom = render(adaptVirtualElementChild(empty), placeholderDom, key);
                    DOM.appendChild(placeholderDom, emptyDom);
                }
                return;
            }
            const elementsDom = list.map((item, i) => {
                const indexValue = indexFn(item, i);
                const indexItem = indexItems.get(indexValue);
                if (indexItem) {
                    return indexItem.dom;
                }
                const childKey = key.clone().pushIndex(i);
                const element = adaptVirtualElementChild(factoryFn(item, i, list));
                const elementDom = render(element, placeholderDom, childKey);
                indexItems.set(indexValue, { dom: elementDom });
                return elementDom;
            });
            DOM.appendChild(placeholderDom, elementsDom);
        });

        registerSignalSubscription(placeholderDom, unsubscribe);
    }
    return placeholderDom;
}

export type { ForProps };
export { For, renderFor };