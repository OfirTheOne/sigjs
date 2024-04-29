import { getActiveContext } from "../component-context";
import type { ComponentContext } from "../component-context";

export interface OnDisconnectHook {
    (): void
}

export function onDisconnect(cb: OnDisconnectHook)  {
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    context.hooks.disconnected.push(cb);
}

export function runOnDisconnectHooks(context: ComponentContext) {
    context.hooks.disconnected.forEach(cb => {
        try {
            cb();
        } catch (error) {
            console.error(error);
        }
    });
}