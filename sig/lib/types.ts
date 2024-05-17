import { CONTROL_FLOW_TAG, ELEMENT_TYPE } from "./constants/constants";

interface ComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): VirtualElement;
    (props: T, children: VirtualElement[]): VirtualElement;
}

interface AsyncComponentFunction<T = any /* Record<string, unknown> */> {
    (props?: T): Promise<VirtualElement>;
}

interface ComponentFunctionWithMeta extends ComponentFunction { 
    __template_id: string;
    __name: string;
}

type VirtualElementChild = VirtualElement | string | number | boolean | null | undefined;

interface VirtualElement {
    type: string;
    props: {
        [key: string]: unknown;
        children: VirtualElementChild[];
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
    VirtualElementChild, 
    ElementRef,
    CommonProps,
    Props,
    ElementType, 
    ControlFlowTag, 
    ComponentFunction, 
    ComponentFunctionWithMeta, 
    AsyncComponentFunction 
};
// export { ELEMENT_TYPE, CONTROL_FLOW_TAG };
