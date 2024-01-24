
type Listener<T = unknown> = (value: T) => void;

interface Signal<T = unknown> {
    (): T;
    value: T;
    setValue(value: T | ((value: T) => T)): void;
    subscribe(listener: Listener<T>): () => void;
    link<L = T>(signal: Signal<L>, pipe?: (value: L) => T): () => void;
    readonly listeners: Listener<T>[];
}

function createSignal<T>(value: T): [Signal<T>, (value: T) => void] {
    let listeners: Listener<T>[] = [];
    const nonCallableSignal: Pick<Signal<T>, 'link' | 'listeners' | 'subscribe' | 'value' | 'setValue'> = {
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
        return this.value;
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

export type { Signal, Listener };
export { createSignal, isSignal, subscribeSignal };