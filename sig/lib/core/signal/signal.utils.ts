import type { Listener, Signal, Unsignalize } from "./signal.types";

export function getSignalValue<T>(signal: Signal<T> | T): T {
    return isSignal<T>(signal) ? signal.value : signal;
}

export function unsignalizeObject<T extends object>(object: T): Unsignalize<T> {
    const result = {} as Unsignalize<T>;
    for (const key in object) {
        const value = object[key];
        result[key as string] = getSignalValue(value) as any;
    }
    return result;
}


export function isSignal<T = unknown>(value: unknown): value is Signal<T> {
    return typeof value === 'function' && typeof (value as Signal<T>).subscribe === 'function';
}

export function subscribeSignal<T = unknown>(signal: Signal<T>, callback: Listener<T>): () => void {
    let lastValue: T = signal.value;
    const unsubscribe = signal.subscribe((value) => {
        lastValue = value;
        callback(value);
    });
    callback(lastValue);
    return unsubscribe;
}


export function listen(
    listener: (changeEvent: { initiator: Signal }) => void, 
    signals: Signal<unknown>[]
): (() => void ){
    const unsubscribe = signals.map(signal => signal.subscribe(() => listener({ initiator: signal })));
    return () => unsubscribe.forEach(unsubscribe => unsubscribe());
}