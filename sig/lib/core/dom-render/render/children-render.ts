import { KeyBuilder } from "@/common/key-builder/key-builder";
import { isNodeElement, isNodeText, isVirtualElement } from "@/core/utils";
import { VirtualElement } from "@/types";
import type { RenderFunction } from "./render.types";
import { DOM } from "@/core/html";

export function childrenRender(
    children: VirtualElement[],
    container: HTMLElement,
    key: KeyBuilder,
    render: RenderFunction
): HTMLElement {
    children.flat(Infinity).filter(Boolean).forEach((child, index) => {
        if(!isVirtualElement(child) && !isNodeElement(child) && !isNodeText(child)) {
            throw new Error('Invalid child element');
        }
        const childKey = key.clone().pushIndex(index);
        const childDom = render(child, container, childKey);
        if (childDom !== container && childDom.parentElement !== container) {
            DOM.appendChild(container, childDom);
        }
    });
    return container;
}
