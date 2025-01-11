import logger from "@/common/logger/logger";
import { getActiveContext } from "../component-context";
import type { ComponentContext } from "../component-context";

export interface OnConnectHook {
    (ctx: ComponentContext): void
}

export function onConnect(cb: OnConnectHook)  {
    const context = getActiveContext();
    if(!context) {
        throw new Error('No active context');
    }
    context.hooks.connect.push(cb);
}

export function runOnConnectHooks(context: ComponentContext) {
    context.hooks.connect.forEach(cb => {
        try {
            cb(context);
        } catch (error) { 
            logger.error(error);
        }
    });
}
