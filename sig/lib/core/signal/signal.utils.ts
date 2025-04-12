import { signal } from "./signal";
import type { Signal, Unsignalize } from "./signal.types";

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


export function listen(
    listener: (changeEvent: { initiator: Signal }) => void, 
    signals: Signal<unknown>[]
): (() => void ){
    const unsubscribe = signals.map(signal => signal.subscribe(() => listener({ initiator: signal })));
    return () => unsubscribe.forEach(unsubscribe => unsubscribe());
}

export function combineLatest<T0, T1 = T0, T2 = T1, T3 = T2, T4 = T3, T5 = T4>(signals: [Signal<T0>, Signal<T1>, Signal<T2>, Signal<T3>, Signal<T4>, Signal<T5>]): Signal<[T0, T1, T2, T3, T4, T5]>;
export function combineLatest<T0, T1 = T0, T2 = T1, T3 = T2, T4 = T3>(signals: [Signal<T0>, Signal<T1>, Signal<T2>, Signal<T3>, Signal<T4>]): Signal<[T0, T1, T2, T3, T4]>;
export function combineLatest<T0, T1 = T0, T2 = T1, T3 = T2>(signals: [Signal<T0>, Signal<T1>, Signal<T2>, Signal<T3>]): Signal<[T0, T1, T2, T3]>;
export function combineLatest<T0, T1 = T0, T2 = T1>(signals: [Signal<T0>, Signal<T1>, Signal<T2>]): Signal<[T0, T1, T2]>;
export function combineLatest<T0, T1 = T0>(signals: [Signal<T0>, Signal<T1>]): Signal<[T0, T1]>;
export function combineLatest<T>(signals: Signal<T>[]): Signal<any> {
    const latestValues: T[] = signals.map(signal => signal.value);
    const combinedSignal = signal<T[]>(latestValues);
    signals.forEach((signal, index) => {
        signal.subscribe(value => {
            latestValues[index] = value;
            combinedSignal.emit([...latestValues]);
        });
    });
    return combinedSignal;
}