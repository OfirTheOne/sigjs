import { keyBuilder } from "@/common/key-builder/key-builder";
import { VirtualElement } from "@/types";
import { render } from "./core-render";
import { DOM } from "@/core/html";

export function rootRender(
    element: VirtualElement,
    container: HTMLElement,
): HTMLElement | Text {
    const key = keyBuilder().pushRoot();
    const dom = render(element, container, key);
    if (dom.parentElement !== container) {
        DOM.appendChild(container, dom);
    }
    return dom;
}
