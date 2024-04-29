import { ElementRef } from "@/types";
import { isSignal, Signal, subscribeSignal } from "../signal";
import { registerSignalSubscription } from "../global/global-hook-executioner";

function attachPropertyToElement(dom: HTMLElement, name: string, value: unknown): unknown {
    if (name === 'children') {
        return;
    }
    if (name === 'className') {
        name = 'class';
    }
    if(name === 'ref') {
        if(typeof value === 'function') {
            value(dom);
            return;
        } else if(typeof value === 'object') {
            (value as ElementRef).current = dom;
            return;
        }
    }

    if (isSignal(value)) {
        return attachSignalToElement(value, dom, name);
    }
    if (typeof value === 'function') {
        attachEventToElement(dom, name, value);
    } else {
        attachAttributeToElement(dom, name, value);
    }
}

function attachAttributeToElement(dom: HTMLElement, name: string, value: unknown): void {
    if (value) {
        dom.setAttribute(name, value as string);
    } else {
        dom.removeAttribute(name);
    }
}

function attachEventToElement(dom: HTMLElement, name: string, value: unknown): void {
    if(!name.startsWith('on')) {
        throw new Error(`Event name must start with 'on'`);
    }
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, value as EventListener);
}

function attachSignalToElement<T = unknown>(
    signal: Signal<T>, 
    element: HTMLElement, 
    property: string
): unknown {
    element.setAttribute(`sid:${property}`, signal.id);
    const unsubscribe = subscribeSignal(signal, (value: unknown) => {
        attachPropertyToElement(element, property, value);
    });
    registerSignalSubscription(element, unsubscribe);
    return unsubscribe;
}

export {
    attachPropertyToElement
};