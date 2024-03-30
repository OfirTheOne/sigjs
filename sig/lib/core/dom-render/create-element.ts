import { isRawElement } from "@/common/is-raw-element";
import { Signal, isSignal } from "@/core/signal";
import { ELEMENT_TYPE } from "@/types";
import type { VirtualElementChild, VirtualElement, ComponentFunction, AsyncComponentFunction, Props } from "@/types";

function createTextElement(text: string): VirtualElement {
    return {
        type: ELEMENT_TYPE.TEXT,
        props: {
            nodeValue: text,
            children: []
        }
    };
}

function createSignalElement<T = unknown>(signal: Signal<T>): VirtualElement {
    return {
        type: ELEMENT_TYPE.SIGNAL,
        props: {
            signal,
            children: []
        }
    };
}

function createEmptyElement(): VirtualElement {
    return {
        type: ELEMENT_TYPE.EMPTY,
        props: {
            children: []
        }
    };
}

function createComponentElement(component: ComponentFunction | AsyncComponentFunction, props: object, ...children: VirtualElementChild[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.COMPONENT,
        props: {
            ...props,
            component,
            children: children.map(adaptVirtualElementChild)
        }
    };
}

function createElement(type: string | ComponentFunction | HTMLElement): VirtualElement;
function createElement<T = Record<string, unknown>>(type: string | ComponentFunction | HTMLElement, props: Props<T>, ...children: VirtualElementChild[]): VirtualElement
function createElement(
    type: string | ComponentFunction | HTMLElement,
    props: Props | undefined = {},
    ...children: VirtualElementChild[]
): VirtualElement {
    const flatChildren = children.flat(Infinity);
    return typeof type === 'function'
        ? createComponentElement(type, props, ...flatChildren)
        : isRawElement(type)
            ? {
                type: ELEMENT_TYPE.RAW,
                props: {
                    ...props,
                    rawElement: type,
                    children: []
                }
            } : {
                type: ELEMENT_TYPE.DOM,
                props: {
                    ...props,
                    tagName: type,
                    children: flatChildren.map(adaptVirtualElementChild)
                }
            };
}

function adaptVirtualElementChild(child: VirtualElementChild): VirtualElement {
    switch (true) {
        case isSignal(child):
            return createSignalElement(child);
        case child === null:
        case child === undefined:
            return createEmptyElement();
        case typeof child === 'object':
            return child;
        case typeof child === 'string':
        case typeof child === 'number':
        case typeof child === 'boolean':
            return createTextElement(String(child));
        default:
            throw new Error(`Invalid child type: ${typeof child}`);
    }
}

export { createElement, createTextElement, createSignalElement, createEmptyElement };