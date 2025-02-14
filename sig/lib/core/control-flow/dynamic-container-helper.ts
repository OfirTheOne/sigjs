import { createElement } from "@/jsx";
import { DOM } from "@/core/html";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import type { RenderFunction } from "@/core/dom-render/render";
import { isVirtualElement } from "../utils";
import { VirtualElement } from "@/types";

export interface DynamicContainerProps {
    /**
     * The tag of the element to render
     * if not provided, it will render a custom element with the tag 'if-ph'
     */
    as?: string | JSX.Element;
    /**
     * The props of the element to render
     */
    asProps?: { [key: string]: unknown };
}

export function createDynamicContainer(
    containerTag: string,
    props: DynamicContainerProps,
    render: RenderFunction,
    key: KeyBuilder,
) {
    const { as, asProps } = props;
    if(as && isVirtualElement(as)) {
        // @TODO validate to be basic tag
        const { props } = as;
        const { children: [], tag, ...propsWithoutChildren } = props;
        const virtualElement = createElement(tag as string, propsWithoutChildren);
        return render(virtualElement, undefined, key) as HTMLElement;
    } else if(as && typeof as === 'string') {
        return render(createElement(as, { ...asProps, role: containerTag }) as VirtualElement, undefined, key) as HTMLElement;
    } else {
        return DOM.createElement(containerTag, key) as HTMLElement;
    } 
           
} 