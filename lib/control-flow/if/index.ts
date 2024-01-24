import { Signal, isSignal } from "@/signal";
import { VirtualElement, ELEMENT_TYPE, CONTROL_FLOW_TAG } from "@/types";

type RenderFunction = (
    element: VirtualElement, 
    container: HTMLElement,
) => HTMLElement | Text;

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
    render: RenderFunction
): HTMLElement | Text {
    const { condition, then, fallback } = (element.props as unknown as IfProps);
    const placeholder = document.createElement('if-ph');
    if (isSignal(condition)) {
        const conditionSignal = condition;
        container.appendChild(placeholder);
        conditionSignal.subscribe((conditionValue) => {
            placeholder.childNodes.forEach(child => child.remove());
            if (conditionValue) {
                const thenElementDom = render(then, placeholder);
                placeholder.appendChild(thenElementDom);
            } else if (fallback) {
                const fallbackElementDom = render(fallback, placeholder);
                placeholder.appendChild(fallbackElementDom);
            } else {
                return container;
            }
        });
    }
    return placeholder;
}

export type { IfProps };
export { If, renderIf };