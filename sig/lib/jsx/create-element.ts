

import { createElement as renderCreateElement } from "@/core/dom-render/create-element";
import { createRawElement } from "@/core/dom-render/create-element/element-factory";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
import { isNodeElement, isNodeText } from "@/core/utils";
import { createFragment } from "./create-fragment";
import type { Renderable, VirtualElement, ComponentFunction } from "@/types";

export function createElement(
    tag: string | ComponentFunction | Text | Element,
    props: { [key: string]: unknown },
    ...children: (Renderable | Text | Element)[]
): VirtualElement  | VirtualElement[]{
    if(typeof tag === 'function' && (tag as any) === createFragment) {
        const fragmentList = createFragment(null, props, ...children) as VirtualElement[];
        return fragmentList.map(adaptVirtualElementChild);
    }

    const virtualChildren = children.map((child) => {
        if (isNodeElement(child) || isNodeText(child)) {
            return createRawElement(child, props, ...children);
        }
        return child;
    });
    return renderCreateElement(tag, props, ...virtualChildren);
}
