import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { isSignal, Signal, subscribeSignal } from '@/core/signal';
import logger from '@/common/logger/logger';
import { DOM } from '@/core/html/html';
import { fragmentExtraction } from "../fragment-extraction";
import { CONTROL_FLOW_TAG, ELEMENT_TYPE } from "@/constants";
import { PropsWithChildren } from "@/types/common";
import { isVirtualElement } from "@/core/utils";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { createElement } from "@/jsx";
import type { VirtualElement } from "@/types";
import type { RenderFunction } from "@/core/dom-render/render";
import type { KeyBuilder } from "@/common/key-builder/key-builder";

/**
 * Switch control flow element props
 * 
 * used in {@link Switch}
 */
interface SwitchProps {
    /**
     * The condition to check
     */
    condition: Signal<any>;
    /**
     * Should memoize all the cases
     * @default true
     */
    memoAll?: boolean;
}

/**
 * Case control flow element props
 * 
 * used in {@link Case}
 */
interface CaseProps {
    /**
     * The value to match, if a function is provided, it will be called with the condition value
     **/
    value: unknown | ((value: unknown) => boolean);
    /**
     * Memoize the element, overrides the memoAll prop in the Switch element
     * @default true
     */
    memo?: boolean;
}

/**
 * Default control flow element props
 * 
 * used in {@link Default}
 */
interface DefaultProps {
    /**
     * Memoize the element, overrides the memoAll prop in the Switch element
     * @default true
     */
    memo?: boolean;
}

export function renderSwitch(
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

    const memoCaseMap = new Map<number | string, HTMLElement | Text | (HTMLElement | Text)[]>();
    const props = (element.props as unknown as PropsWithChildren<SwitchProps>);
    const { condition, children = [], memoAll = true} = props;
    const currentKey = key.clone().push(element.props.controlTag as string);
    const currentKeyString = currentKey.toString();
 
    // Create start and end comment nodes
    const startComment = DOM.createComment('switch;start;'+currentKeyString);
    const endComment = DOM.createComment('switch;end;'+currentKeyString);

    // Append the start and end comment nodes to the container
    DOM.appendChild(container, startComment);
    DOM.appendChild(container, endComment);

    let currentCaseIdx: string | number = -1;

    if (isSignal(condition)) {
        const conditionSignal = condition;
        const unsubscribe = subscribeSignal(conditionSignal, (conditionValue) => {
            // Remove all content between the start and end comments
            let matched = false;
            for (const [idx, child] of Object.entries(children)) {
                if (isVirtualElement(child) && child.meta?.component === Case) {
                    const { value, memo } = (child.props as unknown as PropsWithChildren<CaseProps>);
                    const isMatch = typeof value === 'function' ? value(conditionValue) : value === conditionValue;
                    if (isMatch) {
                        const shouldMemo = (memo === true) || (memoAll && memo !== false);
                        const memoElement = memoCaseMap.get(idx);
                        if (shouldMemo && memoElement) {
                            const currentMatchedResult = DOM.getAllElementsBetween(startComment, endComment) as (HTMLElement | Text)[];
                            memoCaseMap.set(currentCaseIdx, currentMatchedResult);
                            DOM.removeElementsBetween(startComment, endComment);
                            currentCaseIdx = idx;
                            DOM.insertBefore(endComment, memoElement);
                            matched = true;
                            break;
                        }

                        const caseKey = currentKey.clone().push('case');
                        const virtualCaseChildren = child.props.children.map(adaptVirtualElementChild);
                        const renderedResult = render(virtualCaseChildren, renderSandboxContainer, caseKey);
                        const caseDom = fragmentExtraction(renderedResult, renderSandboxContainer);
                        
                        if (shouldMemo) {
                            memoCaseMap.set(idx, caseDom);
                            const isFirstTimeRender = memoCaseMap.size === 0;
                            if(!isFirstTimeRender) {
                                const currentMatchedResult = DOM.getAllElementsBetween(startComment, endComment) as (HTMLElement | Text)[];
                                memoCaseMap.set(currentCaseIdx, currentMatchedResult);
                            }
                        }
                        
                        DOM.removeElementsBetween(startComment, endComment);
                        currentCaseIdx = idx;
                        DOM.insertBefore(endComment, caseDom);
                        matched = true;
                        break;
                    }
                }
            }

            if (!matched) {
                for (const child of children) {
                    if (isVirtualElement(child) && child.meta?.component === Default) {
                        const { memo } = (child.props as unknown as PropsWithChildren<DefaultProps>);
                        const shouldMemo = (memo === true) || (memoAll && memo !== false);
                        const memoElement = memoCaseMap.get(-1);
                        if (shouldMemo && memoElement) {
                            const currentMatchedResult = DOM.getAllElementsBetween(startComment, endComment) as (HTMLElement | Text)[];
                            memoCaseMap.set(currentCaseIdx, currentMatchedResult);
                            DOM.removeElementsBetween(startComment, endComment);
                            currentCaseIdx = -1;
                            DOM.insertBefore(endComment, memoElement);
                            break;
                        }

                        const defaultKey = currentKey.clone().push('default');
                        const virtualDefaultChildren = child.props.children.map(adaptVirtualElementChild);
                        const renderedResult = render(virtualDefaultChildren, renderSandboxContainer, defaultKey);
                        const defaultDom = fragmentExtraction(renderedResult, renderSandboxContainer);
                        
                        if (shouldMemo) {
                            memoCaseMap.set(-1, defaultDom);
                            const isFirstTimeRender = memoCaseMap.size === 0;
                            if(!isFirstTimeRender) {
                                const currentMatchedResult = DOM.getAllElementsBetween(startComment, endComment) as (HTMLElement | Text)[];
                                memoCaseMap.set(currentCaseIdx, currentMatchedResult);
                            }
                        }
                        
                        DOM.removeElementsBetween(startComment, endComment);
                        currentCaseIdx = -1;
                        DOM.insertBefore(endComment, defaultDom);
                        break;
                    }
                }
            }
        });
        registerSignalSubscription(startComment, unsubscribe);
            
    } else {
        logger.error('Switch control flow element condition prop must be a signal, in case of a non-signal condition, use a static conditional rendering instead');
    }
    return container;
}


/**
 * Switch control flow element
 * 
 * @param {SwitchProps} props 
 * @param children Case and Default elements
 *
 * @category Control-Flow
 * @group Control-Flow
 */
export const Switch = (props: SwitchProps, children: VirtualElement[]=[]): VirtualElement => ({
    type: ELEMENT_TYPE.CONTROL_FLOW,
    props: {
        ...props,
        controlTag: CONTROL_FLOW_TAG.SWITCH,
        children
    },
});

/**
 * Case control flow element
 * 
 * @param {CaseProps} props 
 * @param children 
 *
 * @category Control-Flow
 * @group Control-Flow
 */
export const Case = (props: CaseProps, children: VirtualElement[]=[]): VirtualElement => ({
    type: ELEMENT_TYPE.CONTROL_FLOW,
    props: {
        ...props,
        controlTag: CONTROL_FLOW_TAG.CASE,
        children
    },
});

/**
 * Default control flow element
 * 
 * @param {DefaultProps} props 
 * @param children 
 *
 * @category Control-Flow
 * @group Control-Flow
 */
export const Default = (props: DefaultProps, children: VirtualElement[]=[]): VirtualElement => ({
    type: ELEMENT_TYPE.CONTROL_FLOW,
    props: {
        ...props,
        controlTag: CONTROL_FLOW_TAG.DEFAULT,
        children
    },
});

export type { SwitchProps, CaseProps, DefaultProps };
