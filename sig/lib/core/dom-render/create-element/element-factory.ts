import type { VirtualElementChild, VirtualElement, ComponentFunction, AsyncComponentFunction, Props } from "@/types";
import type { Signal } from "@/core/signal";
import { ELEMENT_TYPE } from "@/constants";

export function createTextElement(text: string): VirtualElement {
    return {
        type: ELEMENT_TYPE.TEXT,
        props: {
            nodeValue: text,
            children: []
        }
    };
}

export function createSignalElement<T = unknown>(signal: Signal<T>): VirtualElement {
    return {
        type: ELEMENT_TYPE.SIGNAL,
        props: {
            signal,
            children: []
        }
    };
}

export function createEmptyElement(): VirtualElement {
    return {
        type: ELEMENT_TYPE.EMPTY,
        props: {
            children: []
        }
    };
}

export function createComponentElement(component: ComponentFunction | AsyncComponentFunction, props: object, ...children: VirtualElementChild[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.COMPONENT,
        props: {
            ...props,
            component,
            children, // : children.map(adaptVirtualElementChild)
        }
    };
}

export function createRawElement(rawElement: HTMLElement | Element | Text, props: Props, ...children: VirtualElementChild[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.RAW,
        props: {
            ...props,
            rawElement,
            children
        }
    };
}

export function createDomElement(tagName: string, props: Props, ...children: VirtualElementChild[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.DOM,
        props: {
            ...props,
            tagName,
            children, // : children.map(adaptVirtualElementChild)
        }
    };
}
