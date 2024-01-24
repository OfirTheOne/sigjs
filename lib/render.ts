import { VirtualElement } from "./types";
import { Signal, subscribeSignal } from "./signal";
import { attachPropertyToElement } from "./attach-property";
import { renderIf } from "./control-flow/if";
import { renderFor } from "./control-flow/for";

import { ElementType, ELEMENT_TYPE, ComponentFunctionWithMeta } from "./types";


function renderGlue(dom: Node, container: HTMLElement) {
    container.appendChild(dom);
    return dom;
}

function render(
        element: VirtualElement, 
        container: HTMLElement,
    ): HTMLElement | Text {
    switch (element.type as ElementType) {
        case ELEMENT_TYPE.TEXT:
            return renderText(element.props.nodeValue as string, container);
        case ELEMENT_TYPE.SIGNAL:
            return renderSignal(element.props.signal as Signal, container);
        case ELEMENT_TYPE.EMPTY:
            return container;
        case ELEMENT_TYPE.DOM:
            return renderElement(element, container);
        case ELEMENT_TYPE.COMPONENT:
            return renderComponent(element, container);
        case ELEMENT_TYPE.CONTROL_FLOW:
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
        default:
            throw new Error(`Invalid control flow tag: ${element.props.controlTag}`);
    }
}

function renderComponent(
    componentElement: VirtualElement, 
    container: HTMLElement,
): HTMLElement | Text {
    const {component, ...props } = componentElement.props;
    if(typeof component !== 'function') {
        throw new Error('Component must be a function');
    }

    const componentFunction = component as ComponentFunctionWithMeta;
    const element = componentFunction(props);
    return render(element, container);
}

function renderElement(
    element: VirtualElement, 
    container: HTMLElement,
): HTMLElement {
    const isProperty = (key: string) => key !== 'children';
    const { tagName, children, ...props} = element.props;
    const dom = document.createElement(tagName as string);
    Object.keys(props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, props[name]));
    children.forEach(child => render(child, dom));
    renderGlue(dom, container);
    return dom;
}

function renderText(
    text: string, 
    container: HTMLElement,
): HTMLElement | Text {
    const dom = document.createTextNode(text);
    renderGlue(dom, container);
    return dom;
}

function renderSignal<T = unknown>(
    signal: Signal<T>, 
    container: HTMLElement,
): Text {
    const dom = document.createTextNode(signal.value as string);
    renderGlue(dom, container);
    subscribeSignal(signal, (value: unknown) => {
        dom.nodeValue = value as string;
    });
    return dom;
}

export { render, renderGlue };