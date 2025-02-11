import { CONTROL_FLOW_TAG, ELEMENT_TYPE } from "@/constants";

export interface ComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): Renderable;
    (props: T, children: VirtualElement[]): Renderable;
}

export interface AsyncComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): Promise<Renderable>;
}

export interface ComponentFunctionWithMeta extends ComponentFunction { 
    __template_id: string;
    __name: string;
}

export type RenderablePrimitive = string | number | boolean | null | undefined;

export type Renderable = JSX.IntrinsicElements | VirtualElement | VirtualElement[] | RenderablePrimitive | Element | Text;

export interface VirtualElement {
    type: string;
    props: {
        [key: string]: unknown;
        children: Renderable[];
    };
}

export interface ElementRef<T = HTMLElement> {
    current?: T;
}

export type ElementType = typeof ELEMENT_TYPE[keyof typeof ELEMENT_TYPE];

export type CommonProps = {
    className?: string;
    ref?: ElementRef;
};

export type Props<T = Record<string, unknown>> = T & CommonProps;

export type ControlFlowTag = typeof CONTROL_FLOW_TAG[keyof typeof CONTROL_FLOW_TAG];
