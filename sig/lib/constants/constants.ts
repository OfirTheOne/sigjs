
export const ELEMENT_TYPE = {
    RAW: 'RAW_ELEMENT',
    DOM: 'DOM_ELEMENT',
    TEXT: 'TEXT_ELEMENT',
    SIGNAL: 'SIGNAL_ELEMENT',
    EMPTY: 'EMPTY_ELEMENT',
    COMPONENT: 'COMPONENT_ELEMENT',
    CONTROL_FLOW: 'CONTROL_FLOW_ELEMENT',
    SSR: 'SSR_ELEMENT',
} as const;

export const CONTROL_FLOW_TAG = {
    IF: 'IF',
    FOR: 'FOR',
    AWAIT: 'AWAIT',
    SWITCH: 'SWITCH',
    CASE: 'CASE',
    DEFAULT: 'DEFAULT',
} as const;

export const COMPONENT_NAME_SYMBOL = Symbol('ComponentName');