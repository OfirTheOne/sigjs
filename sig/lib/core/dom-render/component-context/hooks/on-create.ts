import { getActiveContext } from "../component-context";
import type { ComponentContext } from "../component-context";

export interface OnCreateHook {
    (): void
}

export function onCreate(cb: OnCreateHook)  {
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    context.hooks.create.push(cb);
}

export function runOnCreateHooks(context: ComponentContext) {
    context.hooks.create.forEach(cb => {
        try {
            cb();
        } catch (error) { 
            console.error(error);
        }
    });
}
