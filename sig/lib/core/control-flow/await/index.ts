
import { getRenderedRoot, setRenderedRoot } from "@/core/global";
import { AwaitControlFlow } from "@/symbols";
import { AsyncComponentFunction, CONTROL_FLOW_TAG, ELEMENT_TYPE, VirtualElement } from "@/types";

type RenderFunction = (
    element: VirtualElement,
    container: HTMLElement,
) => HTMLElement | Text;

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
    render: RenderFunction
): HTMLElement | Text {
    const root = getRenderedRoot();
    const component = element.props.component as AsyncComponentFunction;
    if (typeof component !== 'function') {
        throw new Error(`Invalid component type: ${component}`);
    }
    const { fallback } = (element.props as unknown as AwaitProps);
    const fallbackDom = render(fallback, container);
    container.appendChild(fallbackDom);
    Promise.resolve(component())
        .then((componentElement) => {
            setRenderedRoot(root.id);
            const componentElementDom = render(componentElement, container);
            if(fallbackDom.parentElement !== container) {
                container.appendChild(componentElementDom);
            } else {
                container.replaceChild(componentElementDom, fallbackDom);
            }
        });
    return fallbackDom;
}

export type { AwaitProps };
export { Await, renderAwait };