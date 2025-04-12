import { registerSignalSubscription } from "@/core/global/global-hook-executioner";
import { Signal } from "@/core/signal";

export function signalRender<T = unknown>(
    signal: Signal<T>,
    container: HTMLElement,
): Text {
    const dom = document.createTextNode(signal.value as string);
    const childIndex = container.children.length;
    container.setAttribute(`data-signal:${childIndex}`, signal.id);
    const unsubscribe = signal.subscribe((value: unknown) => {
        dom.nodeValue = value as string;
    }, { emitOnSubscribe: true });
    registerSignalSubscription(dom, unsubscribe);
    return dom;
}