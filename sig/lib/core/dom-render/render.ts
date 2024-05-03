import type { VirtualElement, ComponentFunctionWithMeta, ElementType } from "../../types";
import type { Signal } from "../signal";
import { subscribeSignal } from "../signal";
import { attachPropertyToElement } from "./attach-property";
import { renderIf } from "../control-flow/if";
import { renderFor } from "../control-flow/for";
import { renderAwait } from "../control-flow/await";
import { ELEMENT_TYPE } from "../../types";
import { isVirtualElement } from "../utils";
import { renderSSR } from "../ssr/ssr";
import { addComponentContext, createComponentContext, removeActiveContext, setActiveContext } from "./component-context/component-context";
import { getRenderedRoot } from "../global";
import { keyBuilder, type KeyBuilder } from "@/common/key-builder/key-builder";
import { registerSignalSubscription } from "../global/global-hook-executioner";
import { DOM } from "../html";
import { runOnCreateHooks } from "./component-context/hooks/on-create";

function rootRender(
    element: VirtualElement,
    container: HTMLElement,
): HTMLElement | Text {
    const key = keyBuilder().pushRoot();
    const dom = render(element, container, key);
    if (dom.parentElement !== container) {
        container.appendChild(dom);
    }
    return dom;
}

function render(element: VirtualElement[], container: HTMLElement, key: KeyBuilder): HTMLElement | Text;
function render(element: VirtualElement, container: HTMLElement | undefined, key: KeyBuilder): HTMLElement | Text;
function render(element: VirtualElement | VirtualElement[], container: HTMLElement | undefined, key: KeyBuilder): HTMLElement | Text {
    if (Array.isArray(element)) {
        if(!container)
            throw new Error('Invalid container element for multiple rendering');
        return renderChildren(element, container, key);
    }
    switch (element.type as ElementType) {
        case ELEMENT_TYPE.TEXT: /* edge node */
            return renderText(element.props.nodeValue as string);
        case ELEMENT_TYPE.DOM: /* non edge node - internally glue any child nodes */
            return renderElement(element, key);
        case ELEMENT_TYPE.RAW: /* edge node */
            if(!element.props.rawElement)
                throw new Error('Invalid raw element for raw rendering');
            key.push((element.props.rawElement as HTMLElement).tagName);
            return element.props.rawElement as HTMLElement;
        case ELEMENT_TYPE.EMPTY: /* edge node */
            if(!container) 
                throw new Error('Invalid container element for empty rendering');
            return container;
        case ELEMENT_TYPE.SIGNAL: /* edge node */
            if(!container) 
                throw new Error('Invalid container element for signal rendering');  
            return renderSignal(element.props.signal as Signal, container);
        case ELEMENT_TYPE.COMPONENT: /* non edge node */
            if(!container) 
                throw new Error('Invalid container element for component rendering');
            return renderComponent(element, container, key);
        case ELEMENT_TYPE.CONTROL_FLOW: /* non edge node - internally glue any child nodes */
            if(!container) 
                throw new Error('Invalid container element for control flow rendering');
            return renderControlFlow(element, container, key);
        case ELEMENT_TYPE.SSR: /* non edge node - internally glue any child nodes */
            if(!container) 
                throw new Error('Invalid container element for SSR rendering');
            return renderSSR(element, container, render, key);
        default:
            throw new Error(`Invalid element type: ${element.type}`);
    }
}  

type RenderFunction = typeof render;

function renderControlFlow(
    element: VirtualElement,
    container: HTMLElement,
    key: KeyBuilder,
): HTMLElement | Text {
    switch (element.props.controlTag) {
        case 'IF':
            return renderIf(element, container, render, key);
        case 'FOR':
            return renderFor(element, container, render, key);
        case 'AWAIT':
            return renderAwait(element, container, render, key);
        default:
            throw new Error(`Invalid control flow tag: ${element.props.controlTag}`);
    }
}

function renderComponent(
    componentElement: VirtualElement,
    container: HTMLElement,
    key: KeyBuilder,
): HTMLElement | Text {
    const { component, ...props } = componentElement.props;
    if (typeof component !== 'function') {
        throw new Error('Component must be a function');
    }
    const componentFunction = component as ComponentFunctionWithMeta;
    const currentKey = key.clone().push(componentFunction.name);
    const context = createComponentContext(componentFunction, container, getRenderedRoot(), currentKey.toString());
    setActiveContext(context);
    const element = componentFunction(props);
    removeActiveContext();
    
    const domElement = render(element, container, currentKey);
    context.element = domElement as Element; 
    console.log('renderComponent', componentFunction.name, currentKey.toString());
    addComponentContext(currentKey.toString(), context);
    runOnCreateHooks(context);
    
    return domElement;
}

function renderElement(
    element: VirtualElement,
    key: KeyBuilder,
): HTMLElement {
    const { tagName, children, ...props } = element.props;
    const currentKey = key.clone().push(tagName as string);
    const dom = DOM.createElement(tagName as string, currentKey);
    const isProperty = (propKey: string) => propKey !== 'children';
    Object.keys(props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, props[name]));
    return renderChildren(children as VirtualElement[], dom, currentKey);
}

function renderChildren(
    children: VirtualElement[],
    container: HTMLElement,
    key: KeyBuilder,
): HTMLElement {
    children.flat(Infinity).filter(Boolean).forEach((child, index) => {
        if(!isVirtualElement(child)) {
            throw new Error('Invalid child element');
        }
        const childKey = key.clone().pushIndex(index);
        const childDom = render(child, container, childKey);
        if (childDom !== container && childDom.parentElement !== container) {
            container.appendChild(childDom);
        }
    });
    return container;
}

function renderText(
    text: string,
): HTMLElement | Text {
    return document.createTextNode(text);
}

function renderSignal<T = unknown>(
    signal: Signal<T>,
    container: HTMLElement,
): Text {
    const dom = document.createTextNode(signal.value as string);
    const childIndex = container.children.length;
    container.setAttribute(`data-signal:${childIndex}`, signal.id);
    const unsubscribe = subscribeSignal(signal, (value: unknown) => {
        dom.nodeValue = value as string;
    });
    registerSignalSubscription(dom, unsubscribe);
    return dom;
}

export { rootRender as render, renderElement, type RenderFunction };