import { createElement } from "@/jsx";
import { DOM } from "@/core/html";
import { KeyBuilder } from "@/common/key-builder/key-builder";
import type { RenderFunction } from "@/core/dom-render/render";

export interface DynamicContainerProps {
    /**
     * The tag of the element to render
     * if not provided, it will render a custom element with the tag 'if-ph'
     */
    as?: string;
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
    return (as ? 
        render(createElement(as, { ...asProps, role: containerTag }), undefined, key) :
        DOM.createElement(containerTag, key)) as HTMLElement;
           
} 