import type { VirtualElement, ComponentFunctionWithMeta, ElementType } from "../../types";
import type { Signal } from "../signal";
import { subscribeSignal } from "../signal";
import { attachPropertyToElement } from "./attach-property";
import { renderIf } from "../control-flow/if";
import { renderFor } from "../control-flow/for";
import { renderAwait } from "../control-flow/await";
import { ELEMENT_TYPE } from "../../types";

function rootRender(
    element: VirtualElement,
    container: HTMLElement,
): HTMLElement | Text {
    const dom = render(element, container);
    if (dom.parentElement !== container) {
        container.appendChild(dom);
    }
    return dom;
}

function render(
    element: VirtualElement,
    container: HTMLElement,
): HTMLElement | Text {
    switch (element.type as ElementType) {
        case ELEMENT_TYPE.TEXT: /* edge node */
            return renderText(element.props.nodeValue as string);
        case ELEMENT_TYPE.SIGNAL: /* edge node */
            return renderSignal(element.props.signal as Signal, container);
        case ELEMENT_TYPE.EMPTY: /* edge node */
            return container;
        case ELEMENT_TYPE.RAW: /* edge node */
            return element.props.rawElement as HTMLElement;
        case ELEMENT_TYPE.DOM: /* non edge node - internally glue any child nodes */
            return renderElement(element);
        case ELEMENT_TYPE.COMPONENT: /* non edge node */
            return renderComponent(element, container);
        case ELEMENT_TYPE.CONTROL_FLOW: /* non edge node - internally glue any child nodes */
            return renderControlFlow(element, container);
        default:
            throw new Error(`Invalid element type: ${element.type}`);
    }
}

function renderControlFlow(
    element: VirtualElement,
    container: HTMLElement
): HTMLElement | Text {
    switch (element.props.controlTag) {
        case 'IF':
            return renderIf(element, container, render);
        case 'FOR':
            return renderFor(element, container, render);
        case 'AWAIT':
            return renderAwait(element, container, render);
        default:
            throw new Error(`Invalid control flow tag: ${element.props.controlTag}`);
    }
}

function renderComponent(
    componentElement: VirtualElement,
    container: HTMLElement,
): HTMLElement | Text {
    const { component, ...props } = componentElement.props;
    if (typeof component !== 'function') {
        throw new Error('Component must be a function');
    }

    const componentFunction = component as ComponentFunctionWithMeta;
    const element = componentFunction(props);
    const domElement = render(element, container);
    return domElement;
}

function renderElement(
    element: VirtualElement,
): HTMLElement {
    const isProperty = (key: string) => key !== 'children';
    const { tagName, children, ...props } = element.props;
    const dom = document.createElement(tagName as string);
    Object.keys(props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, props[name]));
    children.forEach(child => {
        const childDom = render(child, dom);
        if (childDom.parentElement !== dom) {
            dom.appendChild(childDom);
        }
    });
    return dom;
}

function renderText(
    text: string,
): HTMLElement | Text {
    const dom = document.createTextNode(text);
    return dom;
}

function renderSignal<T = unknown>(
    signal: Signal<T>,
    container: HTMLElement,
): Text {
    const dom = document.createTextNode(signal.value as string);
    const childIndex = container.children.length;
    container.setAttribute(`data-signal:${childIndex}`, signal.id);
    subscribeSignal(signal, (value: unknown) => {
        dom.nodeValue = value as string;
    });
    return dom;
}

export { rootRender as render };