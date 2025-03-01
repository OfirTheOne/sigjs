import logger from "@/common/logger/logger";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { Signal, isSignal, subscribeSignal } from "@/core/signal";
import { IfControlFlow } from "@/symbols";
import { ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/constants";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { DynamicContainerProps } from "../dynamic-container-helper";
import type { Renderable, VirtualElement } from "@/types";
import type { RenderFunction } from "@/core/dom-render/render";
import { fragmentExtraction } from "../fragment-extraction";


/**
 * 
 * If control flow element props
 * 
 * used in {@link If}
 * 
 */ 
interface IfProps extends DynamicContainerProps {
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

    const { condition, then, fallback, memo = true } = (element.props as unknown as IfProps);
    const currentKey = key.clone().push(element.props.controlTag as string);
    const currentKeyString = currentKey.toString();
    // Create start and end comment nodes
    const startComment = DOM.createComment('if;start;key:'+currentKeyString);
    const endComment = DOM.createComment('if;end;key:'+currentKeyString);

    // Append the start and end comment nodes to the container
    DOM.appendChild(container, startComment);
    DOM.appendChild(container, endComment);

    let thenElementDom: (HTMLElement | Text) | (HTMLElement | Text)[];
    let fallbackElementDom: (HTMLElement | Text) | (HTMLElement | Text)[];
    if (isSignal(condition)) {
        const conditionSignal = condition;

        const unsubscribe = subscribeSignal(conditionSignal, (conditionValue) => {
            // Remove all content between the start and end comments
            let node = startComment.nextSibling;
            while (node && node !== endComment) {
                const nextNode = node.nextSibling;
                container.removeChild(node);
                node = nextNode;
            }

            if (conditionValue) {
                if (memo && thenElementDom) {
                    DOM.insertBefore(endComment, thenElementDom);
                    return;
                }
                const thenKey = currentKey.clone().push('if-then');
                const virtualThen = adaptVirtualElementChild(then);
                const renderedResult = render(virtualThen, container, thenKey);
                thenElementDom = fragmentExtraction(renderedResult, container);
                DOM.insertBefore(endComment, thenElementDom);
            } else if (fallback) {
                if (memo && fallbackElementDom) {
                    DOM.insertBefore(endComment, fallbackElementDom);
                    return;
                }
                const fallbackKey = currentKey.clone().push('if-fallback');
                const renderedResult = render(adaptVirtualElementChild(fallback), container, fallbackKey);
                fallbackElementDom = fragmentExtraction(renderedResult, container);
                DOM.insertBefore(endComment, fallbackElementDom);
            } else {
                return container;
            }
        });
        registerSignalSubscription(startComment, unsubscribe);
    } else {
        logger.error('If control flow element condition prop must be a signal, in case of a non-signal condition, use a static conditional rendering instead');
    }
    return container; // startComment;
}
/*

function renderIf(
    element: VirtualElement,
    container: HTMLElement,
    render: RenderFunction,
    key: KeyBuilder,
): HTMLElement | Text {

    const { condition, then, fallback, memo = true, as, asProps } = (element.props as unknown as IfProps);
    const currentKey = key.clone().push(element.props.controlTag as string);
    const placeholderDom = createDynamicContainer('if-ph', { as, asProps }, render, currentKey);
    
    let thenElementDom: (HTMLElement | Text) | (HTMLElement | Text)[];
    let fallbackElementDom: (HTMLElement | Text) | (HTMLElement | Text)[];
    if (isSignal(condition)) {
        const conditionSignal = condition;
        DOM.appendChild(container, placeholderDom);
        placeholderDom.setAttribute('signal', conditionSignal.id);

        const unsubscribe = subscribeSignal(conditionSignal, (conditionValue) => {
            DOM.removeAllChildren(placeholderDom);
            if (conditionValue) {
                if(memo && thenElementDom) {
                    DOM.appendChild(placeholderDom, thenElementDom);
                    return;
                }
                const thenKey = currentKey.clone().push('if-then');
                const virtualThen = adaptVirtualElementChild(then);
                const renderedResult = render(virtualThen, placeholderDom, thenKey);
                thenElementDom = fragmentExtraction(renderedResult, placeholderDom);
                DOM.appendChild(placeholderDom, thenElementDom);
            } else if (fallback) {
                if(memo && fallbackElementDom) {
                    DOM.appendChild(placeholderDom, fallbackElementDom);
                    return;
                }
                const fallbackKey = currentKey.clone().push('if-fallback');
                const renderedResult = render(adaptVirtualElementChild(fallback), placeholderDom, fallbackKey);
                fallbackElementDom = fragmentExtraction(renderedResult, placeholderDom); 
                DOM.appendChild(placeholderDom, fallbackElementDom);
            } else {
                return container;
            }
        });
        registerSignalSubscription(placeholderDom, unsubscribe);
    } else {
        logger.error('If control flow element condition prop must be a signal, in case of a non-signal condition, use a static conditional rendering instead');
    }
    return placeholderDom;
}

*/
export type { IfProps };
export { If, renderIf };