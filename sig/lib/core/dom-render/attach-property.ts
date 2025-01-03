import { ElementRef } from "@/types";
import { isSignal, Signal, subscribeSignal } from "../signal";
import { registerSignalSubscription } from "../global/global-hook-executioner";
import { DOM } from "../html";

function attachPropertyToElement(dom: HTMLElement, name: string, value: unknown): unknown {
    if (name === 'children') {
        return;
    }
    if (name === 'className') {
        attachClassComplexValueToElementClass(
            dom,
            value as string | Signal<string> | (string | Signal<string>)[] | Record<string, boolean /* | Signal<boolean> */>
        );
        return;
    }
    if (name === 'ref') {
        if (typeof value === 'function') {
            value(dom);
            return;
        } else if (typeof value === 'object') {
            (value as ElementRef).current = dom;
            return;
        }
    }
    if (name === 'style') {
        if (typeof value === 'object') {
            attachStyleToElement(dom, value as Record<string, string | number | Signal<string | number>>);
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

function attachStyleToElement(
    dom: HTMLElement,
    style: Record<
        string,
        string | number | Signal<string | number>
    >): void {
    for (const key in style) {
        const value = style[key];
        if (isSignal<string | number>(value)) {
            attachSignalToElementStyle(value, dom, key);
        } else {
            attachStylePropertyToElement(dom, key, value);
        }
    }
}

function attachStylePropertyToElement(dom: HTMLElement, styleProperty: string, value: string | number): void {
    const validStyleKey = styleProperty.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    dom.style.setProperty(validStyleKey, value as string);
}

function attachAttributeToElement(dom: HTMLElement, name: string, value: unknown): void {
    if (value !== undefined && value !== null && value !== false) {
        dom.setAttribute(name, value as string);
    } else {
        dom.removeAttribute(name);
    }
    dom[name] = (value as string);
}

function attachEventToElement(dom: HTMLElement, name: string, value: unknown): void {
    if (!name.startsWith('on')) {
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

function attachSignalToElementStyle(
    signal: Signal<string | number>,
    element: HTMLElement,
    property: string
): unknown {
    element.setAttribute(`sid:style:${property}`, signal.id);
    const unsubscribe = subscribeSignal(signal, (value: string | number) => {
        attachStylePropertyToElement(element, property, value);
    });
    registerSignalSubscription(element, unsubscribe);
    return unsubscribe;
}

function attachSignalToElementClass(
    signal: Signal<string>,
    element: HTMLElement
): void {
    const currentSidClass = element.getAttribute(`sid:class`);
    const sidClass = currentSidClass ? `${currentSidClass};${signal.id}` : signal.id;
    element.setAttribute(`sid:class`, sidClass);
    let lastValue: string = signal.value;
    const unsubscribe = subscribeSignal(signal, (value: string) => {
        DOM.classListRemove(element, lastValue);
        DOM.classListAdd(element, value);
        lastValue = value;
    });
    registerSignalSubscription(element, unsubscribe);
}

function attachClassComplexValueToElementClass(
    dom: HTMLElement,
    value: string | Signal<string> | (string | Signal<string>)[] | Record<string, boolean /* | Signal<boolean> */>
): void {
    if (typeof value === 'string') {
        DOM.classListAdd(dom, value);
    } else if (isSignal<string>(value)) {
        attachSignalToElementClass(value, dom);
    } else if (Array.isArray(value)) {
        value.forEach((item) => {
            if (typeof item === 'string') {
                DOM.classListAdd(dom, item);
            } else if (isSignal(item)) {
                attachSignalToElementClass(item, dom);
            }
        });
    } else {
        for (const key in value) {
            const item = value[key];
            dom.classList.toggle(key, Boolean(item));
        }
    }
}


export {
    attachPropertyToElement
};