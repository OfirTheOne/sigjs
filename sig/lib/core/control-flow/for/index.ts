import logger from "@/common/logger/logger";
import { ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/constants";
import { isSignal, Signal, subscribeSignal } from "@/core/signal";
import { ForControlFlow } from "@/symbols";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { fragmentExtraction } from "../fragment-extraction";
import { createElement } from "@/jsx/create-element";
import type { KeyBuilder } from "@/common/key-builder/key-builder";
import type { RenderFunction } from "@/core/dom-render/render";
import type { VirtualElement, Renderable } from "@/types";

/**
 * For control flow element props
 * 
 * used in {@link For}
 * 
 */ 
type ForProps<T = unknown> = ({
    /**
     * Whether to provide the item signal to the factory function
     * Provide the item signal if true
     * In this case, the factory function should have the fourth argument as the item signal
     * @note 
     * Creating an item signal is done be finding an item with the same index-value as the current item that being rendered - that cost O(n)
     * if done for every item, it will cost O(n^2)
     * therefore, it is recommended to use this option only when necessary 
     * 
     */
    provideItemSignal: true;
    /**
     * The factory function to create the elements
     */
    factory: (item: T, index: number, list: T[], itemSignal: Signal<T>) => Renderable;
    
} |{
    provideItemSignal?: false | undefined;
    /**
     * The factory function to create the elements
     */
    factory: (item: T, index: number, list: T[]) => Renderable;
}) & {
    // factory: (item: T, index: number, list: T[]) => Renderable;
    /**
     * The list of items to iterate over
     */ 
    list: Signal<Array<T>>;
    /**
     * The index of the item
     */
    index?: string | ((item: T, i: number) => string);
    
    
    memo?: boolean;
    /**
     * The element to render when the list is empty
     */
    empty?: Renderable;
};
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

function renderFor(
    element: VirtualElement,
    container: HTMLElement,
    render: RenderFunction,
    key: KeyBuilder
): HTMLElement | Text {

    const renderSandboxContainer = render(
        createElement('div', {}), 
        undefined,
        key.clone().push('sandbox')
    ) as HTMLElement;

    const { list, factory, index, empty, memo = true, provideItemSignal } = (element.props as unknown as ForProps);
    const currentKey = key.clone().push(element.props.controlTag as string);
    const currentKeyString = currentKey.toString();

    // Create start and end comment nodes
    const startComment = document.createComment('for;start;'+currentKeyString);
    const endComment = document.createComment('for;end;'+currentKeyString);

    // Append the start and end comment nodes to the container
    container.appendChild(startComment);
    container.appendChild(endComment);

    const indexFn = typeof index === 'function' ? index : ((item: unknown, i: number) => {
        if (typeof index === 'undefined' || index === null) {
            return typeof item === 'object' ? String(i) : String(item);
        }
        return item?.[index as string] as string;
    });
    const indexItems = new Map<string, { dom: (HTMLElement | Text | (HTMLElement | Text)[]); }>();

    if (!isSignal<Array<unknown>>(list)) {  
        logger.error('For control flow element list prop must be a signal, in case of a non-signal list, use a static mapping instead');
    } else {
        const listSignal = list;
        const unsubscribe = subscribeSignal(listSignal, (list) => {
            // Remove all content between the start and end comments
            DOM.removeElementsBetween(startComment, endComment);

            if (list.length === 0) {
                if (empty !== undefined) {
                    const renderedResult = render(adaptVirtualElementChild(empty), container, key);
                    const emptyDom = fragmentExtraction(renderedResult, container);
                    DOM.insertBefore(endComment, emptyDom);
                }
                return;
            }
            
            const elementsDom = list.map((item, i) => {
                const indexValue = indexFn(item, i);
                if (memo) {
                    const indexItem = indexItems.get(indexValue);
                    if (indexItem) {
                        return indexItem.dom;
                    }
                }
                const childKey = key.clone().pushIndex(i);
                let element: Renderable;
                if (provideItemSignal) {
                    const itemSignal = listSignal.derive((items) => items.find((_, idx) => indexFn(_, idx) === indexValue));
                    element = adaptVirtualElementChild(factory(item, i, list, itemSignal));
                } else {
                    element = adaptVirtualElementChild(factory(item, i, list));
                }
                const renderedResult = render(element, renderSandboxContainer, childKey);
                const elementDom = fragmentExtraction(renderedResult, renderSandboxContainer);
                if (memo) {
                    indexItems.set(indexValue, { dom: elementDom });
                }
                return elementDom;
            });

            elementsDom.forEach((elementDom) => DOM.insertBefore(endComment, elementDom));
        });

        registerSignalSubscription(startComment, unsubscribe);
    }
    return container;
}

export type { ForProps };
export { For, renderFor };