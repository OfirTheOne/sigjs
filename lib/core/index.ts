import { addGlobal  } from "./global";
addGlobal();

import { createElement } from "./create-element";
import { createRoot } from "./create-root";
import { render } from "./render";
import { Signal, isSignal, subscribeSignal, createSignal } from "./signal/signal";
import type { VirtualElement } from "../types";

export type {
    VirtualElement,
    Signal
};

export {
    createRoot,
    createSignal,
    isSignal,
    subscribeSignal,
    createElement,
    render,
};