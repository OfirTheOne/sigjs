import { KeyBuilder } from "@/common/key-builder/key-builder";
import { DOM } from "@/core/html";
import { VirtualElement } from "@/types";
import { attachPropertyToElement } from "../attach-property";
import type { RenderFunction } from "./render.types";

export function elementRender(
    element: VirtualElement,
    key: KeyBuilder,
    render: RenderFunction,
): HTMLElement {
    const { tagName, children, ...props } = element.props;
    const currentKey = key.clone().push(tagName as string);
    const dom = DOM.createElement(tagName as string, currentKey);
    const isProperty = (propKey: string) => propKey !== 'children';
    Object.keys(props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, props[name]));
    return render(children as VirtualElement[], dom, currentKey) as HTMLElement;
}
