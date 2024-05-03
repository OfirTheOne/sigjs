

import { createElement as renderCreateElement } from "../core/dom-render/create-element";
import * as elements from "@/convenient/element";
import { ELEMENT_TYPE } from "@/types";
import type { VirtualElementChild, VirtualElement, ComponentFunction } from "@/types";

export function createElement(
    tag: string | ComponentFunction,
    props: { [key: string]: unknown },
    ...children: VirtualElementChild[]
) {
    children = children.map(child => {
        if (child instanceof HTMLElement) {
            return (<VirtualElement>{
                type: ELEMENT_TYPE.RAW,
                props: {
                    rawElement: child,
                    children: []
                }
            });     
        }
        return child;
    });

    if(typeof tag === 'string' && tag in elements) {
       return elements[tag](props, ...children);
    }


    return renderCreateElement(tag, props, ...children);
}
