import { createElement } from "@/jsx";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { Signal, isSignal, subscribeSignal } from "@/core/signal";
import { IfControlFlow } from "@/symbols";
import { ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/constants";
import type { Renderable, VirtualElement } from "@/types";
import type { RenderFunction } from "@/core/dom-render/render";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";


/**
 * 
 * If control flow element props
 * 
 * used in {@link If}
 * 
 */ 
interface IfProps {
    /**
     * The condition to check
     */
    condition: Signal<any>;
    /**
     * The element to render when the condition is true
     */
    then: Renderable;
    /**
     * The element to render when the condition is false
     */
    fallback?: Renderable;
    /**
     * Memoize the elements
     * @default true
     */
    memo?: boolean
    /**
     * The tag of the element to render
     * if not provided, it will render a custom element with the tag 'if-ph'
     */
    as?: string;
    /**
     * The props of the element to render
     */
    asProps?: { [key: string]: unknown };
}

/**
 * If control flow element
 * @param {IfProps} props - If control flow element props
 * 
 * @category Control-Flow
 * @group Control-Flow
 */
function If(props: IfProps): VirtualElement {
    return {
        type: ELEMENT_TYPE.CONTROL_FLOW,
        props: {
            children: [],
            ...props,
            controlTag: CONTROL_FLOW_TAG.IF,
        }
    };
}

If['$$type'] = IfControlFlow;

customElements.define('if-ph', class extends HTMLElement { });

function renderIf(
    element: VirtualElement,
    container: HTMLElement,
    render: RenderFunction,
    key: KeyBuilder,
): HTMLElement | Text {
    const { condition, then, fallback, memo = true, as, asProps } = (element.props as unknown as IfProps);
    const currentKey = key.clone().push(element.props.controlTag as string);
    const placeholderDom = (as ? 
        render(createElement(as, { ...asProps, role: 'if-ph' }), undefined, key) :
        DOM.createElement('if-ph', currentKey)) as HTMLElement;
        
    let thenElementDom: HTMLElement | Text;
    let fallbackElementDom: HTMLElement | Text;
    if (isSignal(condition)) {
        const conditionSignal = condition;
        DOM.appendChild(container, placeholderDom);
        placeholderDom.setAttribute('signal', conditionSignal.id);

        const unsubscribe = subscribeSignal(conditionSignal, (conditionValue) => {
            placeholderDom.childNodes.forEach(child => child.remove());
            if (conditionValue) {
                if(memo && thenElementDom) {
                    DOM.appendChild(placeholderDom, thenElementDom);
                    return;
                }
                const thenKey = currentKey.clone().push('if-then');
                thenElementDom = render(adaptVirtualElementChild(then), placeholderDom, thenKey);
                DOM.appendChild(placeholderDom, thenElementDom);
            } else if (fallback) {
                if(memo && fallbackElementDom) {
                    DOM.appendChild(placeholderDom, fallbackElementDom);
                    return;
                }
                const fallbackKey = currentKey.clone().push('if-fallback');
                fallbackElementDom = render(adaptVirtualElementChild(fallback), placeholderDom, fallbackKey);
                DOM.appendChild(placeholderDom, fallbackElementDom);
            } else {
                return container;
            }
        });
        registerSignalSubscription(placeholderDom, unsubscribe);
    }
    return placeholderDom;
}

export type { IfProps };
export { If, renderIf };