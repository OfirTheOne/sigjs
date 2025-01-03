import { Signal, CoreSignalCapabilities, EnhancedSignalCapabilities, StaleSignalCapabilities, Listener, RememberPreviousValueSignalCapabilities, SignalOptions } from "./signal.types";

let signalCounter = 0

type BuildSignalResult<T> 
    = CoreSignalCapabilities<T> 
    & EnhancedSignalCapabilities<T>
    & RememberPreviousValueSignalCapabilities<T> 
    & StaleSignalCapabilities;

function buildSignal<T>(value: T, options?: SignalOptions): BuildSignalResult<T> {
    let listeners: Listener<T>[] = [];
    let staleMode = false;
    let _prevValue: T | undefined;
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
        | 'previousValue'
        | 'setValue'
        | 'enterStaleMode'
        | 'exitStaleMode'
    > = {
        id: options?.id || String(signalCounter),
        get previousValue() { return _prevValue; },
        get value() { return value; },
        set value(newValue: T) {
            if(options?.rememberPrevValue) {
                _prevValue = value;
            }
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
            return () => { listeners = listeners.filter(l => l !== listener); };
        },
        enterStaleMode() { staleMode = true; },
        exitStaleMode() { staleMode = false; },
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
        get listeners() { return listeners; },
        get linkedSubscriptions() { return linkedSubscriptions; }
    };
    return nonCallableSignal;
}

function signal<T>(value: T, options?: SignalOptions): Signal<T> {

    const nonCallableSignal = buildSignal(value, options);

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
    Object.defineProperty(callableSignal, 'previousValue', {
        get() {
            return nonCallableSignal.previousValue;
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

function createSignal<T>(value: T, options?: SignalOptions): [Signal<T>, Signal<T>['setValue']] {
    const callableSignal = signal(value, options);
    return [callableSignal as Signal<T>, callableSignal.setValue];
}

export { createSignal, signal, buildSignal };