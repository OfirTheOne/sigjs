

import { createElement as renderCreateElement } from "@/core/dom-render/create-element";
import { adaptVirtualElementChild } from "@/core/dom-render/create-element/adapt-virtual-element-child";
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
    return renderCreateElement(tag, props, ...children);
}
