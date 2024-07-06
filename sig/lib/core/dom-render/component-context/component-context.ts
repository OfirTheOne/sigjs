import type { RootElementWithMetadata } from "../create-root";
import type { OnConnectHook } from "./hooks/on-connect";
import type { OnDisconnectHook } from "./hooks/on-disconnect";
import type { OnCreateHook } from "./hooks/on-create";

export interface ComponentContext {
    hooks: {
        create: OnCreateHook[];
        connect: OnConnectHook[];
        disconnect: OnDisconnectHook[];
    },
    key: string;
    container: Element | null;
    element?: Element; 
    elementKey?: string; // @TODO remove
    root: RootElementWithMetadata;
    component: (...args: unknown[]) => unknown;
}

export function createComponentContext(
    component: (...args: unknown[]) => unknown,
    container: Element | null, 
    root: RootElementWithMetadata,
    key: string,
): ComponentContext {
    return {
        hooks: {
            create: [],
            connect: [],
            disconnect: [],
        },
        key,
        root,
        container,
        component
    }
}

const activeContextStack: ComponentContext[] = [];

export function getActiveContext() {
    return activeContextStack[activeContextStack.length - 1];
}

export function setActiveContext(context: ComponentContext) {
    activeContextStack.push(context);
}

export function removeActiveContext() {
    activeContextStack.pop();
}



const contextMap = new Map<string, ComponentContext>();

export function getComponentContext(key: string) {
  return contextMap.get(key);
}

export function addComponentContext(key: string, context: ComponentContext) {
  contextMap.set(key, context);
}

export function getAllSubContexts(key: string): ComponentContext[] {
    const contextEntries = Array.from(contextMap.entries());
    const subContextEntries = contextEntries.filter(([contextKey]) => contextKey.startsWith(key));
    const sortedSubContexts = subContextEntries.sort(([keyA], [keyB]) => keyA < keyB ? -1 : 1);
    return sortedSubContexts.map(([_, context]) => context);
}

