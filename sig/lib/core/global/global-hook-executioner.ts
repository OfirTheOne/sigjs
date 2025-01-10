
import { isSignal } from "../signal/signal.utils";
import type { Signal } from "../signal/signal.types";
import { getAllSubContexts } from "../dom-render/component-context/component-context";
import { runOnDisconnectHooks } from "../dom-render/component-context/hooks/on-disconnect";
import { ElementKeySymbol } from "@/symbols";
import { runOnConnectHooks } from "../dom-render/component-context/hooks/on-connect";
import logger from "@/common/logger/logger";

const globalSubscribersMap = new Map<Node, {
    signals: Signal[],
    subscriptions: (()=>void)[]
}>();

export function registerSignalSubscription(node: Node, signalOrSub: Signal | (()=>void)) {
    const sub = globalSubscribersMap.get(node) || {
        signals: [],
        subscriptions: []
    };
    isSignal(signalOrSub) ?
      sub.signals.push(signalOrSub) :
      sub.subscriptions.push(signalOrSub);

    globalSubscribersMap.set(node, sub);
}

function createHookExecutioner() {
    const hookExecutioner = {
        observer: new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    const elementKey = node[ElementKeySymbol];
                    logger.log('createHookExecutioner ', elementKey, node.nodeName);

                    if(elementKey) {
                        const contexts = getAllSubContexts(elementKey);
                        contexts.forEach(context => {
                            logger.log(context.elementKey, 'Element was added to the DOM');
                            if (context) {
                                runOnConnectHooks(context);
                            }
                            const element = context.element;
                            const subEntry = element && globalSubscribersMap.get(element)
                            if (subEntry) {
                                subEntry.signals.forEach(signal => {
                                    signal.exitStaleMode();
                                });
                            }
                        });
                    }

                });                
                mutation.removedNodes.forEach((node) => {
                    const elementKey = node[ElementKeySymbol];
                    if(elementKey) {
                        const contexts = getAllSubContexts(elementKey);
                        contexts.forEach(context => {
                            logger.log(context.elementKey, 'Element was removed from the DOM');
                            if (context) {
                                runOnDisconnectHooks(context);
                            }
                            const element = context.element;
                            const subEntry = element && globalSubscribersMap.get(element)
                            if (subEntry) {
                                logger.log('Element was removed from the DOM');
                                subEntry.signals.forEach(signal => {
                                    signal.enterStaleMode();
                                });
                            }
                        });
                    }
                });
            });
        }),

    };
    return hookExecutioner;
}

export function observeRoot(root: HTMLElement) {
    const hookExecutioner = createHookExecutioner();
    hookExecutioner.observer.observe(root, { childList: true, subtree: true });
    return hookExecutioner;
}
