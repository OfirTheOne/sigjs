import { Signal, CoreSignalCapabilities, EnhancedSignalCapabilities, Listener } from "./signal.types";

let signalCounter = 0

function buildSignal<T>(value: T, id?: string):
    CoreSignalCapabilities<T> &
    EnhancedSignalCapabilities<T> {
    let listeners: Listener<T>[] = [];
    const linkedSubscriptions: (() => void)[] = [];
    const nonCallableSignal: Pick<Signal<T>
        , 'id'
        | 'link'
        | 'derive'
        | 'listeners'
        | 'subscribe'
        | 'linkedSubscriptions'
        | 'disconnect'
        | 'emit'
        | 'value'
        | 'setValue'
    > = {
        id: id || String(signalCounter),
        get value() {
            return value;
        },
        set value(newValue: T) {
            value = newValue;
            this.emit(newValue);
        },
        emit(value: T) {
            listeners.forEach(listener => listener(value));
        },
        setValue(newValue: ((value: T) => T) | T) {
            if (typeof newValue === 'function') {
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
        disconnect() {
            listeners = [];
            this.linkedSubscriptions.forEach(unsubscribe => unsubscribe());
            this.linkedSubscriptions.length = 0;
        },
        link<L = T>(signal: Signal<L>, pipe?: (value: L) => T) {
            const unsubscribe = signal.subscribe((value) => {
                if (pipe) {
                    this.value = pipe(value);
                } else {
                    this.value = value as unknown as T;
                }
            });
            this.linkedSubscriptions.push(unsubscribe);
            return unsubscribe;
        },
        derive<L = T>(pipe: (value: T) => L) {
            const [derivedSignal, setDerivedSignal] = createSignal(pipe(this.value));
            this.subscribe((value) => setDerivedSignal(pipe(value)));
            return derivedSignal;
        },
        get listeners() {
            return listeners;
        },
        get linkedSubscriptions() {
            return linkedSubscriptions;
        }
    };
    return nonCallableSignal;
}

function signal<T>(value: T, id?: string): Signal<T> {

    const nonCallableSignal = buildSignal(value, id);

    const callableSignal = function (this: Signal<T>) {
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
    Object.defineProperty(callableSignal, 'linkedSubscriptions', {
        get() {
            return nonCallableSignal.linkedSubscriptions;
        }
    });
    Object.defineProperty(callableSignal, 'id', {
        get() {
            return nonCallableSignal.id;
        }
    });
    callableSignal.subscribe = nonCallableSignal.subscribe;
    callableSignal.disconnect = nonCallableSignal.disconnect;
    callableSignal.link = nonCallableSignal.link;
    callableSignal.derive = nonCallableSignal.derive;
    callableSignal.setValue = nonCallableSignal.setValue;
    callableSignal.emit = nonCallableSignal.emit;
    signalCounter++;
    return callableSignal as Signal<T>;
}

function createSignal<T>(value: T, id?: string): [Signal<T>, (value: T) => void] {
    const callableSignal = signal(value, id);
    return [callableSignal as Signal<T>, (newValue: T) => callableSignal.value = newValue];
}

export { createSignal, signal, buildSignal };