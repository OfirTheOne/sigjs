import { Signal, CoreSignalCapabilities, EnhancedSignalCapabilities, StaleSignalCapabilities, Listener } from "./signal.types";

let signalCounter = 0

function buildSignal<T>(value: T, id?: string):
    CoreSignalCapabilities<T> &
    EnhancedSignalCapabilities<T> & 
    StaleSignalCapabilities {
    let listeners: Listener<T>[] = [];
    let staleMode = false;
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
        | 'enterStaleMode'
        | 'exitStaleMode'
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
            if (!staleMode) {                
                listeners.forEach(listener => listener(value));
            }
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
        enterStaleMode() {
            staleMode = true;
        },
        exitStaleMode() {
            staleMode = false;
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
    callableSignal.setValue = nonCallableSignal.setValue.bind(nonCallableSignal);
    callableSignal.emit = nonCallableSignal.emit;
    callableSignal.enterStaleMode = nonCallableSignal.enterStaleMode;
    callableSignal.exitStaleMode = nonCallableSignal.exitStaleMode;
    signalCounter++;
    return callableSignal as Signal<T>;
}

function createSignal<T>(value: T, id?: string): [Signal<T>, Signal<T>['setValue']] {
    const callableSignal = signal(value, id);
    return [callableSignal as Signal<T>, callableSignal.setValue];
}

export { createSignal, signal, buildSignal };