import logger from "@/common/logger/logger";
import { getActiveContext } from "../component-context";
import type { ComponentContext } from "../component-context";

export interface OnDisconnectHook {
    (ctx: ComponentContext): void
}

export function onDisconnect(cb: OnDisconnectHook)  {
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    context.hooks.disconnect.push(cb);
}

export function runOnDisconnectHooks(context: ComponentContext) {
    context.hooks.disconnect.forEach(cb => {
        try {
            cb(context);
        } catch (error) {
            logger.error(error);
        }
    });
}