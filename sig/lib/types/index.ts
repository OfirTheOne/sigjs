import { CONTROL_FLOW_TAG, ELEMENT_TYPE } from "../constants/constants";

interface ComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): Renderable;
    (props: T, children: VirtualElement[]): Renderable;
}

interface AsyncComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): Promise<Renderable>;
}

interface ComponentFunctionWithMeta extends ComponentFunction { 
    __template_id: string;
    __name: string;
}

type RenderablePrimitive = string | number | boolean | null | undefined;

type Renderable = JSX.IntrinsicElements | VirtualElement | RenderablePrimitive;

interface VirtualElement {
    type: string;
    props: {
        [key: string]: unknown;
        children: Renderable[];
    };
}

interface ElementRef<T = HTMLElement> {
    current?: T;
}

type ElementType = typeof ELEMENT_TYPE[keyof typeof ELEMENT_TYPE];

type CommonProps = {
    className?: string;
    ref?: ElementRef;
};

type Props<T = Record<string, unknown>> = T & CommonProps;

type ControlFlowTag = typeof CONTROL_FLOW_TAG[keyof typeof CONTROL_FLOW_TAG];

export type { 
    VirtualElement, 
    Renderable, 
    ElementRef,
    CommonProps,
    Props,
    ElementType, 
    ControlFlowTag, 
    ComponentFunction, 
    ComponentFunctionWithMeta, 
    AsyncComponentFunction 
};
