

// import { IfControlFlow, ForControlFlow, AwaitControlFlow } from "@/symbols";
import { createElement as renderCreateElement } from "../core/dom-render/create-element";
import * as elements from "@/convenient/element";
import { VirtualElementChild } from "@/types";

// const isControlFlow = (tag: (...args: unknown[]) => unknown) => {
//     return typeof tag === 'function' && [
//         IfControlFlow,
//         ForControlFlow,
//         AwaitControlFlow
//     ].includes(tag['$$type']);
// }

export function createElement(
    tag: string | ((...args: unknown[]) => unknown),
    props: { [key: string]: unknown },
    ...children: VirtualElementChild[]
) {
    if (typeof tag === 'function') {
        return tag(props, children);
        // if (isControlFlow(tag)) {
        // }
    }

    else if(typeof tag === 'string' && tag in elements) {
       return elements[tag](props, ...children);
    }


    return renderCreateElement(tag, props, ...children);
}
