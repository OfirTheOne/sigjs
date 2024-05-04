import { KeyBuilder } from "@/common/key-builder/key-builder";
import { ELEMENT_TYPE, ElementType, VirtualElement } from "@/types";
import { elementRender } from "./element-render";
import { textRender } from "./text-render";
import { childrenRender } from "./children-render";
import { signalRender } from "./signal-render";
import { Signal } from "@/core/signal";
import { componentRender } from "./component-render";
import { renderSSR } from "@/core/ssr";
import { controlFlowRender } from "./control-flow-render";


function render(element: VirtualElement[], container: HTMLElement, key: KeyBuilder): HTMLElement | Text;
function render(element: VirtualElement, container: HTMLElement | undefined, key: KeyBuilder): HTMLElement | Text;
function render(element: VirtualElement | VirtualElement[], container: HTMLElement | undefined, key: KeyBuilder): HTMLElement | Text {
    if (Array.isArray(element)) {
        if (!container)
            throw new Error('Invalid container element for multiple rendering');
        return childrenRender(element, container, key, render);
    }
    switch (element.type as ElementType) {

        case /* edge node */
            ELEMENT_TYPE.TEXT:
            return textRender(element.props.nodeValue as string);

        case /* non edge node - internally glue any child nodes */
            ELEMENT_TYPE.DOM:
            return elementRender(element, key, render);

        case /* edge node */
            ELEMENT_TYPE.RAW:
            if (!element.props.rawElement)
                throw new Error('Invalid raw element for raw rendering');
            key.push((element.props.rawElement as HTMLElement).tagName);
            return element.props.rawElement as HTMLElement;

        case /* edge node */
            ELEMENT_TYPE.EMPTY:
            if (!container)
                throw new Error('Invalid container element for empty rendering');
            return container;

        case /* edge node */
            ELEMENT_TYPE.SIGNAL:
            if (!container)
                throw new Error('Invalid container element for signal rendering');
            return signalRender(element.props.signal as Signal, container);

        case /* non edge node */
            ELEMENT_TYPE.COMPONENT:
            if (!container)
                throw new Error('Invalid container element for component rendering');
            return componentRender(element, container, key, render);

        case /* non edge node - internally glue any child nodes */
            ELEMENT_TYPE.CONTROL_FLOW:
            if (!container)
                throw new Error('Invalid container element for control flow rendering');
            return controlFlowRender(element, container, key, render);

        case /* non edge node - internally glue any child nodes */
            ELEMENT_TYPE.SSR:
            if (!container)
                throw new Error('Invalid container element for SSR rendering');
            return renderSSR(element, container, key, render);

        default:
            throw new Error(`Invalid element type: ${element.type}`);
    }
}


export { render };