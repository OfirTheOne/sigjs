import { VirtualElement } from "./types";
import { Signal, subscribeSignal } from "./signal";
import { attachPropertyToElement } from "./attach-property";
import { renderIf } from "./control-flow/if";
import { renderFor } from "./control-flow/for";

import { ElementType, ELEMENT_TYPE, ComponentFunctionWithMeta } from "./types";

function render(element: VirtualElement, container: HTMLElement): unknown {
    switch (element.type as ElementType) {
        case ELEMENT_TYPE.TEXT:
            return renderText(element.props.nodeValue as string, container);
        case ELEMENT_TYPE.SIGNAL:
            renderSignal(element.props.signal as Signal, container);
            return container;
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

function renderControlFlow(element: VirtualElement, container: HTMLElement): unknown {
    switch (element.props.controlTag) {
        case 'IF':
            return renderIf(element, container, render);
        case 'FOR':
            return renderFor(element, container, render);
        default:
            throw new Error(`Invalid control flow tag: ${element.props.controlTag}`);
    }
}

function renderComponent(componentElement: VirtualElement, container: HTMLElement): unknown {
    const {component, ...props } = componentElement.props;
    if(typeof component !== 'function') {
        throw new Error('Component must be a function');
    }

    const componentFunction = component as ComponentFunctionWithMeta;
    const element = componentFunction(props);
    return render(element, container);
}

function renderElement(element: VirtualElement, container: HTMLElement): unknown {
    const isProperty = (key: string) => key !== 'children';
    const tagName = element.props.tagName as string;
    const dom = document.createElement(tagName);
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, element.props[name]));
    element.props.children.forEach(child => render(child, dom));
    container.appendChild(dom);
    return dom;
}

function renderText(text: string, container: HTMLElement): unknown {
    const dom = document.createTextNode(text);
    container.appendChild(dom);
    return dom;
}

function renderSignal<T = unknown>(signal: Signal<T>, container: HTMLElement): unknown {
    const dom = document.createTextNode(signal.value as string);
    container.appendChild(dom);
    return subscribeSignal(signal, (value: unknown) => {
        dom.nodeValue = value as string;
    });
}

export { render };