import { createElement } from "./dom-render/create-element";
import { createRoot } from "./dom-render/create-root";
import { render } from "./dom-render/render";
import { isSignal, subscribeSignal, createSignal } from "./signal";
import type { Signal } from "./signal";

export type {
    Signal
};

export {
    createRoot,
    createSignal,
    isSignal,
    subscribeSignal,
    createElement as element,
    render,
};