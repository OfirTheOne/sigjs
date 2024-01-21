import type { Signal } from "./signal";

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
    COMPONENT: 'COMPONENT_ELEMENT'
} as const;

type ElementType = typeof ELEMENT_TYPE[keyof typeof ELEMENT_TYPE];

export type { VirtualElement, VirtualElementChild, ElementType };
export { ELEMENT_TYPE };
