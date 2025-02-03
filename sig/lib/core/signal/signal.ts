import { Signal, CoreSignalCapabilities, EnhancedSignalCapabilities, StaleSignalCapabilities, Listener, RememberPreviousValueSignalCapabilities, SignalOptions, CreateSignalFn, Selector } from "./signal.types";
import { extractValue } from "@/common/extract-value";

let signalCounter = 0

/** @internal @ignore */
type BuildSignalResult<T> 
    = CoreSignalCapabilities<T> 
    & EnhancedSignalCapabilities<T>
    & RememberPreviousValueSignalCapabilities<T> 
    & StaleSignalCapabilities;

/** @internal @ignore */
type NonCallableSignal<T> = Pick<Signal<T>
, 'id'
| 'link'
| 'derive'
| 'select'
| 'listeners'
| 'subscribe'
| 'linkedSubscriptions'
| 'disconnect'
| 'updateOptions'
| 'emit'
| 'value'
| 'previousValue'
| 'setValue'
| 'enterStaleMode'
| 'exitStaleMode'
>;

/** @internal @ignore */
function buildSignal<T>(value: T, options?: SignalOptions<T>): BuildSignalResult<T> {
    const usedOptions = {
        id: options?.id || String(signalCounter),
        compare: options?.compare || defaultCompare,
        rememberPrevValue: options?.rememberPrevValue || true,
        emitOnExitStaleMode: options?.emitOnExitStaleMode || false,
        emitOnValueNotChanged: options?.emitOnValueNotChanged || false,
    };
    let _listeners: Listener<T>[] = [];
    let _staleMode = false;
    let _prevValue: T | undefined;
    
    const _linkedSubscriptions: (() => void)[] = [];

    const nonCallableSignal: NonCallableSignal<T> = {
        id: usedOptions.id,
        get listeners() { return _listeners; },
        get linkedSubscriptions() { return _linkedSubscriptions; },
        get previousValue() { return _prevValue; },
        get value() { return value; },
        set value(newValue: T) {
            if(usedOptions?.rememberPrevValue) {
                _prevValue = value;
            }
            value = newValue;
            self.emit(newValue);
        },
        updateOptions(newOptions: Partial<Omit<SignalOptions<T>, 'id'>>) {
            if('id' in newOptions) delete newOptions['id'];
            Object.assign(usedOptions, newOptions);
        },
        emit(value: T) {
            if (!_staleMode) {
                const shouldEmit = usedOptions.emitOnValueNotChanged || !usedOptions.compare(self.previousValue, value);
                if (shouldEmit) {
                    _listeners.forEach(listener => listener(value));
                }
            }
        },
        enterStaleMode() { _staleMode = true; },
        exitStaleMode() { 
            if (!_staleMode) return;
            _staleMode = false; 
            if (usedOptions?.emitOnExitStaleMode) {
                self.emit(value);
            }
        },
        setValue(newValue: ((value: T) => T) | T) {
            self.value = (typeof newValue === 'function') ? 
                (newValue as (value: T) => T)(self.value) :
                newValue;
        },
        subscribe(listener: Listener<T>, subscribeOptions) {
            const usedSubscribeOptions = {
                emitOnSubscribe: subscribeOptions?.emitOnSubscribe || false,
                compare: subscribeOptions?.compare || defaultCompare,
                ignoreCompare: subscribeOptions?.ignoreCompare || false,
            };
            if (usedSubscribeOptions?.emitOnSubscribe) {
                listener(self.value);
            }

            const usedListener = usedSubscribeOptions.ignoreCompare ? listener : (value: T) => {
                const invokeListener 
                    = usedOptions.emitOnValueNotChanged 
                    || !usedSubscribeOptions.compare(self.previousValue, value);
                if (invokeListener) {
                    listener(value);
                }
            };

            _listeners.push(usedListener);
            return () => { _listeners = _listeners.filter(l => l !== usedListener); };
        },
        disconnect() {
            _listeners = [];
            self.linkedSubscriptions.forEach(unsubscribe => unsubscribe());
            self.linkedSubscriptions.length = 0;
        },
        link<L = T>(signal: Signal<L>, pipe?: (value: L) => T) {
            const unsubscribe = signal.subscribe((value) => {
                self.value = pipe ? pipe(value) : value as unknown as T;
            });
            self.linkedSubscriptions.push(unsubscribe);
            return unsubscribe;
        },
        derive<L = T> (pipe: (value: T) => L, options?: SignalOptions<L>): Signal<L> {
            return derive(self, createSignal, pipe, options);
        },
        /**
         * Select a property from the current signal using the key of the property.
         * Using `derive` internally. 
         * @param keysAndSelectors The keys or selectors to select the property
         * @returns A signal containing the selected property 
         */
        select(...keysAndSelectors: (keyof any | Selector<any, any>)[]): Signal<any> {
            return self.derive(_value => extractValue(keysAndSelectors, _value));
        }
    };
    const self = nonCallableSignal
    return nonCallableSignal;
}


/**
 * Create a signal
 * @param {T} value  The initial value of the signal
 * @param {SignalOptions} options Options for the signal
 * @returns {Signal<T>} A signal
 * @example
 * const counter = signal(0);
 * counter.subscribe(value => console.log(value));
 * counter.setValue(1);
 * counter.setValue((prevValue) => prevValue + 1);
 * // console logs:
 * // > 0
 * // > 1
 * // > 2
 * @example
 * const counter = signal(0, { id: 'counter' });
 * console.log(counter.id);
 * // > 'counter'
 * @example
 * const counter = signal(0, { rememberPrevValue: true });
 * console.log(counter.previousValue);
 * counter.setValue(1);
 * console.log(counter.previousValue);
 * // console logs:
 * // > undefined
 * // > 0
 */
function signal<T>(value: T, options?: SignalOptions<T>): Signal<T> {

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
    callableSignal.select = nonCallableSignal.select;
    callableSignal.setValue = nonCallableSignal.setValue.bind(nonCallableSignal);
    callableSignal.emit = nonCallableSignal.emit;
    callableSignal.updateOptions = nonCallableSignal.updateOptions;
    callableSignal.enterStaleMode = nonCallableSignal.enterStaleMode;
    callableSignal.exitStaleMode = nonCallableSignal.exitStaleMode;
    signalCounter++;
    return callableSignal as Signal<T>;
}

/**
 * Create a signal and a function to set the value of the signal
 * @param {T} value  The initial value of the signal
 * @param {SignalOptions} options Options for the signal 
 * @returns {[Signal<T>, Signal<T>['setValue']]} A tuple containing the signal and a function to set the value of the signal
 */
const createSignal: CreateSignalFn = <T>(value: T, options?: SignalOptions<T>): [Signal<T>, Signal<T>["setValue"]] => {
    const callableSignal = signal(value, options);
    return [callableSignal as Signal<T>, callableSignal.setValue];
}

export { createSignal, signal, buildSignal };




/** @internal */
function derive<T,L = T>(
    self: NonCallableSignal<T>,
    createSignalFn: CreateSignalFn,
    pipe: (value: T) => L, 
    options?: SignalOptions<L>
): Signal<L> {
    const pipedValue =  pipe(self.value);
    const [derivedSignal, setDerivedSignal] = createSignalFn(pipedValue, options);
    self.subscribe((value) => {
        const _pipedValue = pipe(value);
        setDerivedSignal(_pipedValue);
    });
    return derivedSignal;
}



const defaultCompare: NonNullable<SignalOptions['compare']> = <T>(prev: T | undefined, next: T) => prev === next;