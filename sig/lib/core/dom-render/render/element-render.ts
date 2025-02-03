import { KeyBuilder } from "@/common/key-builder/key-builder";
import { DOM } from "@/core/html";
import { attachPropertyToElement } from "../attach-property";
import type { VirtualElement } from "@/types";
import type { RenderFunction } from "./render.types";

const ignoredProps = ['children', 'ref'];
const isProperty = (propKey: string) => !ignoredProps.includes(propKey);

export function elementRender(
    element: VirtualElement,
    key: KeyBuilder,
    render: RenderFunction,
): HTMLElement {
    const { tagName, children, ...props } = element.props;
    const currentKey = key.clone().push(tagName as string);
    const dom = DOM.createElement(tagName as string, currentKey);
    const renderResult = render(children as VirtualElement[], dom, currentKey) as HTMLElement;
    Object.keys(props)
        .filter(isProperty)
        .forEach(name => attachPropertyToElement(dom, name, props[name]));
    handleElementRef(renderResult, props);
    return renderResult;
}


function handleElementRef(
    renderedDomElement: HTMLElement,
    props: Record<string, unknown>,
): void {
    const { ref } = props;
    if (ref) {
        if (typeof ref === 'function') {
            ref(renderedDomElement);
        } else if (typeof ref === 'object' && 'current' in ref) {
            ref.current = renderedDomElement;
        }
    }
}