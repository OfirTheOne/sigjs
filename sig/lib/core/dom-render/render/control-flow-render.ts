import { KeyBuilder } from "@/common/key-builder/key-builder";
import { renderAwait } from "@/core/control-flow/await";
import { renderFor } from "@/core/control-flow/for";
import { renderIf } from "@/core/control-flow/if";
import { VirtualElement } from "@/types";
import { RenderFunction } from "./render.types";
import { CONTROL_FLOW_TAG } from "@/constants";
import { renderSwitch } from "@/core/control-flow/switch-case";

export function controlFlowRender(
    element: VirtualElement,
    container: HTMLElement,
    key: KeyBuilder,
    render: RenderFunction
): HTMLElement | Text {
    switch (element.props.controlTag) {
        case CONTROL_FLOW_TAG.IF:
            return renderIf(element, container, render, key);
        case CONTROL_FLOW_TAG.FOR:
            return renderFor(element, container, render, key);
        case CONTROL_FLOW_TAG.AWAIT:
            return renderAwait(element, container, render, key);
        case CONTROL_FLOW_TAG.SWITCH:
            return renderSwitch(element, container, render, key);
        default:
            throw new Error(`Invalid control flow tag: ${element.props.controlTag}`);
    }
}