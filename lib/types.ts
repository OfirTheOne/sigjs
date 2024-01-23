import type { Signal } from "./signal";

interface ComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): VirtualElement;
}

interface ComponentFunctionWithMeta extends ComponentFunction { 
    __template_id: string;
    __name: string;
}

type VirtualElementChild = VirtualElement | Signal<any> | string | number | boolean | null | undefined ;

interface VirtualElement {
    type: string;
    props: {
        [key: string]: unknown;
        children: VirtualElement[];
    };
}

const ELEMENT_TYPE = {
    DOM: 'DOM_ELEMENT',
    TEXT: 'TEXT_ELEMENT',
    SIGNAL: 'SIGNAL_ELEMENT',
    EMPTY: 'EMPTY_ELEMENT',
    COMPONENT: 'COMPONENT_ELEMENT',
    CONTROL_FLOW: 'CONTROL_FLOW_ELEMENT'
} as const;

type ElementType = typeof ELEMENT_TYPE[keyof typeof ELEMENT_TYPE];

const CONTROL_FLOW_TAG = {
    IF: 'IF',
    FOR: 'FOR'
} as const;

type ControlFlowTag = typeof CONTROL_FLOW_TAG[keyof typeof CONTROL_FLOW_TAG];

export type { VirtualElement, VirtualElementChild, ElementType, ControlFlowTag, ComponentFunction, ComponentFunctionWithMeta };
export { ELEMENT_TYPE, CONTROL_FLOW_TAG };
