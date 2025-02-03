import { isSignal } from "@/core/signal";
import { Renderable, VirtualElement } from "@/types";
import { createSignalElement, createEmptyElement, createTextElement } from "../create-element";
import { createRawElement } from "./element-factory";
import { isRawElement } from "@/core/utils";



export function adaptVirtualElementChild(child: Renderable): VirtualElement {
    switch (true) {
        case isSignal(child):
            return createSignalElement(child);
        case child === null:
        case child === undefined:
        case child === false:
            return createEmptyElement();
        case isRawElement(child):
            return createRawElement(child, {});
        case typeof child === 'object':
            return <VirtualElement>child ;
        case typeof child === 'string':
        case typeof child === 'number':
        case typeof child === 'boolean':
            return createTextElement(String(child));
        default:
            throw new Error(`Invalid child type: ${typeof child}`);
    }
}
