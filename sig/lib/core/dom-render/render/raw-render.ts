import { KeyBuilder } from "@/common/key-builder/key-builder";
import { VirtualElement } from "@/types";
import { attachPropertyToElement } from "../attach-property";
import type { RenderFunction } from "./render.types";

export function rawRender(
    element: VirtualElement,
    key: KeyBuilder,
    render: RenderFunction,
): HTMLElement {
    const { rawElement, children, ...props } = element.props;
    const dom = rawElement as HTMLElement;
    const currentKey = key.clone().push(dom.tagName as string);
    const isProperty = (propKey: string) => propKey !== 'children';
    render(children as VirtualElement[], dom, currentKey) as HTMLElement;
    Object.keys(props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, props[name]));
    return dom
}
