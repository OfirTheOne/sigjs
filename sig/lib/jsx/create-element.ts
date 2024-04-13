

import { createElement as renderCreateElement } from "../core/dom-render/create-element";
import * as elements from "@/convenient/element";
import { VirtualElementChild } from "@/types";

export function createElement(
    tag: string | ((...args: unknown[]) => unknown),
    props: { [key: string]: unknown },
    ...children: VirtualElementChild[]
) {
    if (typeof tag === 'function') {
        return tag(props, children);
    }

    else if(typeof tag === 'string' && tag in elements) {
       return elements[tag](props, ...children);
    }


    return renderCreateElement(tag, props, ...children);
}
