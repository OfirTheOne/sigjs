import { Signal, Listener } from "./signal.types";

let signalCounter = 0

function createSignal<T>(value: T, id?: string): [Signal<T>, (value: T) => void] {
    let listeners: Listener<T>[] = [];
    const nonCallableSignal: Pick<Signal<T>, 'id' | 'link' | 'listeners' | 'subscribe' | 'emit' | 'value' | 'setValue'> = {
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
    Object.defineProperty(callableSignal, 'id', {
        get() {
            return nonCallableSignal.id;
        }
    });
    callableSignal.subscribe = nonCallableSignal.subscribe;
    callableSignal.link = nonCallableSignal.link;
    callableSignal.setValue = nonCallableSignal.setValue;
    callableSignal.emit = nonCallableSignal.emit;
    signalCounter++;
    return [callableSignal as Signal<T>, (newValue: T) => nonCallableSignal.value = newValue];
}


export { createSignal };