
import { KeyBuilder } from "@/common/key-builder/key-builder";
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { DOM } from "@/core/html";
import { AwaitControlFlow } from "@/symbols";
import { CONTROL_FLOW_TAG, ELEMENT_TYPE } from "@/constants";
import type { RenderFunction } from "@/core/dom-render/render";
import type { AsyncComponentFunction, VirtualElement } from "@/types";

interface AwaitProps {
    fallback: VirtualElement,
    component: AsyncComponentFunction;
}

function Await(props: AwaitProps): VirtualElement {
    return {
        type: ELEMENT_TYPE.CONTROL_FLOW,
        props: {
            children: [],
            ...props,
            controlTag: CONTROL_FLOW_TAG.AWAIT,
        }
    };
}

Await['$$type'] = AwaitControlFlow;


function renderAwait(
    element: VirtualElement,
    container: HTMLElement,
    render: RenderFunction,
    key: KeyBuilder
): HTMLElement | Text {
    const root = getRenderedRoot();
    const component = element.props.component as AsyncComponentFunction;
    if (typeof component !== 'function') {
        throw new Error(`Invalid component type: ${component}`);
    }
    const currentKey = key.clone().push(element.props.controlTag as string);
    const { fallback } = (element.props as unknown as AwaitProps);
    const fallbackDom = render(fallback, container, currentKey);
    DOM.appendChild(container, fallbackDom);
    Promise.resolve(component())
        .then((componentElement) => {
            setRenderedRoot(root.id);
            const componentElementDom = render(componentElement, container, currentKey);
            if (fallbackDom.parentElement !== container) {
                DOM.appendChild(container, componentElementDom);
            } else {
                container.replaceChild(componentElementDom, fallbackDom);
            }
        });
    return fallbackDom;
}

export type { AwaitProps };
export { Await, renderAwait };