import type { Renderable, VirtualElement, ComponentFunction, AsyncComponentFunction, Props } from "@/types";
import type { Signal } from "@/core/signal";
import { ELEMENT_TYPE, COMPONENT_NAME_SYMBOL } from "@/constants";

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
        },
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

export function createComponentElement(component: ComponentFunction | AsyncComponentFunction, props: object, ...children: Renderable[]): VirtualElement {
    const componentName = component.name;
    return {
        type: ELEMENT_TYPE.COMPONENT,
        props: {
            ...props,
            children,
        },
        meta: {
            component,
            [COMPONENT_NAME_SYMBOL]: componentName,
        }
    };
}

export function createRawElement(rawElement: HTMLElement | Element | Text, props: Props, ...children: Renderable[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.RAW,
        props: {
            ...props,
            rawElement,
            children
        }
    };
}

export function createDomElement(tagName: string, props: Props, ...children: Renderable[]): VirtualElement {
    return {
        type: ELEMENT_TYPE.DOM,
        props: {
            ...props,
            tagName,
            children,
        }
    };
}
