import { isSignal } from "@/core/signal";
import { VirtualElementChild, VirtualElement } from "@/types";
import { createSignalElement, createEmptyElement, createTextElement } from "../create-element";



export function adaptVirtualElementChild(child: VirtualElementChild): VirtualElement {
    switch (true) {
        case isSignal(child):
            return createSignalElement(child);
        case child === null:
        case child === undefined:
        case child === false:
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
