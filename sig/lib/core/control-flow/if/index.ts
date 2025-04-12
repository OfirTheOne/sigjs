import logger from "@/common/logger/logger";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { Signal, isSignal } from "@/core/signal";
import { IfControlFlow } from "@/symbols";
import { ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/constants";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { fragmentExtraction } from "../fragment-extraction";
import { createElement } from "@/jsx";
import type { KeyBuilder } from "@/common/key-builder/key-builder";
import type { Renderable, VirtualElement } from "@/types";
import type { RenderFunction } from "@/core/dom-render/render";


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

function renderIf(
    element: VirtualElement,
    container: HTMLElement,
    render: RenderFunction,
    key: KeyBuilder,
): HTMLElement | Text {
    const renderSandboxContainer = render(
        createElement('div', {}), 
        undefined,
        key.clone().push('sandbox')
    ) as HTMLElement;
    
    const { condition, then, fallback, memo = true } = (element.props as unknown as IfProps);
    const currentKey = key.clone().push(element.props.controlTag as string);
    const currentKeyString = currentKey.toString();
    // Create start and end comment nodes
    const startComment = DOM.createComment('if;start;key:'+currentKeyString);
    const endComment = DOM.createComment('if;end;key:'+currentKeyString);

    // Append the start and end comment nodes to the container
    DOM.appendChild(container, startComment);
    DOM.appendChild(container, endComment);

    let previousConditionValue: null | boolean = null;

    let thenElementDom: (HTMLElement | Text) | (HTMLElement | Text)[];
    let fallbackElementDom: (HTMLElement | Text) | (HTMLElement | Text)[];
    if (isSignal(condition)) {
        const conditionSignal = condition;
        const unsubscribe = conditionSignal.subscribe((conditionValue) => {
            // Remove all content between the start and end comments

            const booleanConditionValue = Boolean(conditionValue)
            if (previousConditionValue === booleanConditionValue) {
                return;
            }
            const currentRenderedDom = DOM.getAllElementsBetween(startComment, endComment) as (HTMLElement | Text) | (HTMLElement | Text)[];;
            previousConditionValue = booleanConditionValue;
            DOM.removeElementsBetween(startComment, endComment);

            if (booleanConditionValue) {
                if (memo && thenElementDom) {
                    fallbackElementDom = currentRenderedDom     
                    DOM.insertBefore(endComment, thenElementDom);
                    return;
                }
                const thenKey = currentKey.clone().push('if-then');
                const virtualThen = adaptVirtualElementChild(then);
                const renderedResult = render(virtualThen, renderSandboxContainer, thenKey);
                thenElementDom = fragmentExtraction(renderedResult, renderSandboxContainer);
                DOM.insertBefore(endComment, thenElementDom);
            } else if (fallback) {
                if (memo && fallbackElementDom) {
                    DOM.insertBefore(endComment, fallbackElementDom);
                    return;
                }
                const fallbackKey = currentKey.clone().push('if-fallback');
                const renderedResult = render(adaptVirtualElementChild(fallback), renderSandboxContainer, fallbackKey);
                fallbackElementDom = fragmentExtraction(renderedResult, renderSandboxContainer);
                DOM.insertBefore(endComment, fallbackElementDom);
            }
        }, { emitOnSubscribe: true });
        registerSignalSubscription(startComment, unsubscribe);
    } else {
        logger.error('If control flow element condition prop must be a signal, in case of a non-signal condition, use a static conditional rendering instead');
    }
    return container; // startComment;
}

export type { IfProps };
export { If, renderIf };