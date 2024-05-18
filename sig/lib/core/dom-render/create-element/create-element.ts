import type { Renderable, VirtualElement, ComponentFunction, Props } from "@/types";
import { isRawElement } from "@/core/utils";
import { adaptVirtualElementChild } from "./adapt-virtual-element-child";
import { createComponentElement, createRawElement, createDomElement } from "./element-factory";


export function createElement(type: string | ComponentFunction | HTMLElement | Element | Text,): VirtualElement;
export function createElement<T = Record<string, unknown>>(type: string | ComponentFunction<T> | HTMLElement | Element | Text, props: Props<T>, ...children: Renderable[]): VirtualElement
export function createElement(
    type: string | ComponentFunction | HTMLElement | Element | Text,
    props: Props | undefined = {},
    ...children: Renderable[]
): VirtualElement {
    const flatChildren = children.filter(Boolean).flat(Infinity).filter(Boolean);
    const adaptedChildren = flatChildren.map(adaptVirtualElementChild);
    return typeof type === 'function'
        ? createComponentElement(type, props, ...adaptedChildren)
        : isRawElement(type) ? 
            createRawElement(type,  props, ...adaptedChildren) :
            createDomElement(type, props, ...adaptedChildren);
}
