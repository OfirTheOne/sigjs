import { KeyBuilder } from "@/common/key-builder/key-builder";
import { isVirtualElement } from "@/core/utils";
import { VirtualElement } from "@/types";
import type { RenderFunction } from "./render.types";

export function childrenRender(
    children: VirtualElement[],
    container: HTMLElement,
    key: KeyBuilder,
    render: RenderFunction
): HTMLElement {
    children.flat(Infinity).filter(Boolean).forEach((child, index) => {
        if(!isVirtualElement(child)) {
            throw new Error('Invalid child element');
        }
        const childKey = key.clone().pushIndex(index);
        const childDom = render(child, container, childKey);
        if (childDom !== container && childDom.parentElement !== container) {
            container.appendChild(childDom);
        }
    });
    return container;
}
