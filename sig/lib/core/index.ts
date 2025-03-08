import { createElement } from "./dom-render/create-element";
import { createRoot } from "./dom-render/create-root";
import { render } from "./dom-render/render";
import { onConnect, OnConnectHook } from './dom-render/component-context/hooks/on-connect';
import { onCreate, OnCreateHook } from './dom-render/component-context/hooks/on-create';
import { onDisconnect, OnDisconnectHook } from './dom-render/component-context/hooks/on-disconnect';

export type {
    OnConnectHook,
    OnCreateHook,
    OnDisconnectHook
};

export * from './control-flow';

export * from './create-ref';

export * from './ssr/ssr';

export type * from "./signal/signal.types";

export  { isSignal, subscribeSignal, createSignal, combineLatest } from "./signal";

export * from './dom-render/create-element/element-factory';

export {
    onConnect,
    onCreate,
    onDisconnect,
    createRoot,
    createElement as element,
    render,
};