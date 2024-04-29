import { getActiveContext } from "../component-context";
import type { ComponentContext } from "../component-context";

export interface OnConnectHook {
    (): void
}

export function onConnect(cb: OnConnectHook)  {
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    context.hooks.connected.push(cb);
}

export function runOnConnectHooks(context: ComponentContext) {
    context.hooks.connected.forEach(cb => {
        try {
            cb();
        } catch (error) { 
            console.error(error);
        }
    });

    context.hooks.disconnected.forEach(cb => {
        try {
            cb();
        } catch (error) {
            console.error(error);
        }
    });
}
