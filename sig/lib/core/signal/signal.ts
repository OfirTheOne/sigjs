import { Signal, Listener } from "./types";

let signalCounter = 0

function createSignal<T>(value: T, id?: string): [Signal<T>, (value: T) => void] {
    let listeners: Listener<T>[] = [];
    const nonCallableSignal: Pick<Signal<T>, 'id' | 'link' | 'listeners' | 'subscribe' | 'value' | 'setValue'> = {
        id: id ?? String(signalCounter),
        get value() {
            return value;
        },
        set value(newValue: T) {
            value = newValue;
            listeners.forEach(listener => listener(value));
        },
        setValue(newValue: ((value: T) => T) | T ) {
            if(typeof newValue === 'function') {
                this.value = (newValue as (value: T) => T)(this.value);
            } else {
                this.value = newValue;
            }
        },
        subscribe(listener: Listener<T>) {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        },

        link<L = T>(signal: Signal<L>, pipe?: (value: L) => T) {
            return signal.subscribe((value) => {
                if(pipe) {
                    this.value = pipe(value);
                } else {
                    this.value = value as unknown as T;
                }

            });
        },
        get listeners() {
            return listeners;
        }
    };
    const callableSignal = function(this: Signal<T>) {
        return nonCallableSignal.value;
    };
    Object.defineProperty(callableSignal, 'value', {
        get() {
            return nonCallableSignal.value;
        },
        set(newValue: T) {
            nonCallableSignal.value = newValue;
        }
    });
    Object.defineProperty(callableSignal, 'listeners', {
        get() {
            return nonCallableSignal.listeners;
        }
    });
    callableSignal.subscribe = nonCallableSignal.subscribe;
    callableSignal.link = nonCallableSignal.link;
    signalCounter++;
    return [callableSignal as Signal<T>, (newValue: T) => nonCallableSignal.value = newValue];
}

function isSignal<T = unknown>(value: unknown): value is Signal<T> {
    return typeof value === 'function' && typeof (value as Signal<T>).subscribe === 'function';
}

function subscribeSignal<T = unknown>(signal: Signal<T>, callback: Listener<T>): () => void {
    let lastValue: T = signal.value;
    const unsubscribe = signal.subscribe((value) => {
        lastValue = value;
        callback(value);
    });
    callback(lastValue);
    return unsubscribe;
}


export { createSignal, isSignal, subscribeSignal };