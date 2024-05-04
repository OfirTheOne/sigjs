import { KeyBuilder } from "@/common/key-builder/key-builder";
import { renderAwait } from "@/core/control-flow/await";
import { renderFor } from "@/core/control-flow/for";
import { renderIf } from "@/core/control-flow/if";
import { VirtualElement } from "@/types";
import { RenderFunction } from "./render.types";

export function controlFlowRender(
    element: VirtualElement,
    container: HTMLElement,
    key: KeyBuilder,
    render: RenderFunction
): HTMLElement | Text {
    switch (element.props.controlTag) {
        case 'IF':
            return renderIf(element, container, render, key);
        case 'FOR':
            return renderFor(element, container, render, key);
        case 'AWAIT':
            return renderAwait(element, container, render, key);
        default:
            throw new Error(`Invalid control flow tag: ${element.props.controlTag}`);
    }
}