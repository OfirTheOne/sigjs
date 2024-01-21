import { VirtualElement, Signal, subscribeSignal } from ".";
import { attachPropertyToElement } from "./attach-property";
import { ElementType, ELEMENT_TYPE } from "./types";

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
            throw new Error('Component elements are not supported yet');
        default:
            throw new Error(`Invalid element type: ${element.type}`);
    }
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