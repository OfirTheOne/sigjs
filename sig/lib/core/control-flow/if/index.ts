import { KeyBuilder } from "@/common/key-builder/key-builder";
import type { RenderFunction } from "@/core/dom-render/render";
import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { DOM } from "@/core/html";
import { Signal, isSignal, subscribeSignal } from "@/core/signal";
import { IfControlFlow } from "@/symbols";
import { VirtualElement, ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/types";


interface IfProps {
    condition: Signal<any>;
    then: VirtualElement;
    fallback?: VirtualElement;
    memo?: boolean
}

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
    const placeholder = DOM.createElement('if-ph', currentKey);
    let thenElementDom: HTMLElement | Text;
    let fallbackElementDom: HTMLElement | Text;
    if (isSignal(condition)) {
        const conditionSignal = condition;
        container.appendChild(placeholder);
        placeholder.setAttribute('signal', conditionSignal.id);

        const unsubscribe = subscribeSignal(conditionSignal, (conditionValue) => {
            placeholder.childNodes.forEach(child => child.remove());
            if (conditionValue) {
                if(memo && thenElementDom) {
                    placeholder.appendChild(thenElementDom);
                    return;
                }
                const thenKey = currentKey.clone().push('if-then');
                thenElementDom = render(then, placeholder, thenKey);
                placeholder.appendChild(thenElementDom);
            } else if (fallback) {
                if(memo && fallbackElementDom) {
                    placeholder.appendChild(fallbackElementDom);
                    return;
                }
                const fallbackKey = currentKey.clone().push('if-fallback');
                fallbackElementDom = render(fallback, placeholder, fallbackKey);
                placeholder.appendChild(fallbackElementDom);
            } else {
                return container;
            }
        });
        registerSignalSubscription(placeholder, unsubscribe);
    }
    return placeholder;
}

export type { IfProps };
export { If, renderIf };