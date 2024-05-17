

import { createElement as renderCreateElement } from "../core/dom-render/create-element";
import * as elements from "@/convenient/element";
import { isNodeElement, isNodeText } from "@/core/utils";
import { ELEMENT_TYPE } from "@/constants";
import type { VirtualElementChild, VirtualElement, ComponentFunction } from "@/types";

export function createElement(
    tag: string | ComponentFunction | Text | Element,
    props: { [key: string]: unknown },
    ...children: (VirtualElementChild | Text | Element)[]
): VirtualElement {
    const virtualChildren = children.map((child) => {
        if (isNodeElement(child) || isNodeText(child)) {
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
       return elements[tag](props, ...virtualChildren);
    }


    return renderCreateElement(tag, props, ...virtualChildren);
}
