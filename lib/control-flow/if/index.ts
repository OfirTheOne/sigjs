import { Signal, isSignal } from "@/signal";
import { VirtualElement, ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/types";

interface IfProps {
    condition: Signal<any>;
    then: VirtualElement;
    fallback?: VirtualElement;
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
customElements.define('if-ph', class extends HTMLElement {});

function renderIf(
    element: VirtualElement, 
    container: HTMLElement, 
    render: ((element: VirtualElement, container: HTMLElement) => unknown)
): unknown {
    const { condition, then, fallback } = (element.props as unknown as IfProps);
    const placeholder = document.createElement('if-ph');
    if (!isSignal(condition)) {
        return container;
    } else {
        const conditionSignal = condition;
        container.appendChild(placeholder);
        conditionSignal.subscribe((conditionValue) => {
            placeholder.childNodes.forEach(child => child.remove());
            if (conditionValue) {
                return render(then, placeholder);
            } else if (fallback) {
                return render(fallback, placeholder);
            } else {
                return container;
            }
        });
    }
}

export type { IfProps };
export { If, renderIf };