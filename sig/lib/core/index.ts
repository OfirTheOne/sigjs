import { createElement } from "./dom-render/create-element";
import { createRoot } from "./dom-render/create-root";
import { render } from "./dom-render/render";
import { isSignal, subscribeSignal, createSignal } from "./signal";
import type { Signal } from "./signal";
import { onConnect, OnConnectHook } from './dom-render/component-context/hooks/on-connect';
import { onCreate, OnCreateHook } from './dom-render/component-context/hooks/on-create';
import { onDisconnect, OnDisconnectHook } from './dom-render/component-context/hooks/on-disconnect';

export type {
    Signal,
    OnConnectHook,
    OnCreateHook,
    OnDisconnectHook
};

export * from './control-flow';

export * from './create-ref';

export * from './ssr/ssr';

export {
    onConnect,
    onCreate,
    onDisconnect,
    createRoot,
    createSignal,
    isSignal,
    subscribeSignal,
    createElement as element,
    render,
};