type SignalOptions<T = unknown> = {
    id?: string;
    rememberPrevValue?: boolean;
    emitOnExitStaleMode?: boolean;
    emitOnValueNotChanged?: boolean;
    compare?: (prev: T | undefined, next: T) => boolean;
    condition?: ((value: T) => boolean) | ((value: T) => boolean)[],
}

type SubscriberOptions<T> = {
    emitOnSubscribe?: boolean;
    compare?: (prev: T | undefined, next: T) => boolean;
    ignoreCompare?: boolean;
}

/** @internal */
type Listener<T = unknown> = (value: T) => void;

interface CoreSignalCapabilities<T> {
    id: string;
    value: T;
    setValue(value: T | ((value: T) => T)): void;
    updateOptions(newOptions: Partial<Omit<SignalOptions<T>, 'id'>>): void; 
    emit(value: T): void;
    /**
     *  Subscribe to the signal
     *  
     * @param listener  The listener function
     * @param options   Options for the subscription
     * @param options.emitOnSubscribe Emit the current value when subscribing, run the listener immediately on subscribe
     *                
     * @returns A function that unsubscribes the listener
     */
    subscribe(
        listener: Listener<T>, 
        options?: SubscriberOptions<T>
    ): () => void;
    readonly listeners: Listener<T>[];
    disconnect(): void;
}
interface StaleSignalCapabilities {
    enterStaleMode: () => void;
    exitStaleMode: () => void;
}

export type Selector<T, R> = (value: T) => R;

type KeyOrSelector<T, R> = keyof T | Selector<T, R>;

type Resolve<T, P> = P extends keyof T ? T[P] : P extends Selector<T, infer R> ? R : never;


interface EnhancedSignalCapabilities<T> {
    /**
     * Derive a new signal from the current signal
     * @param pipe A function that transforms the value of the current signal
     * @returns A new signal with the transformed value
     * @example
     * const numberSignal = signal(1);
     * const stringSignal = numberSignal.derive(value => String(value));
     * console.log(stringSignal()); 
     * stringSignal.subscribe(value => console.log(value));
     * numberSignal.setValue(2); 
     * console logs:
     * // > '1'
     * // > '2'
     */ 
    derive<L = T>(pipe: (value: T) => L, options?: SignalOptions<L>): Signal<L>;

    select<K1 extends KeyOrSelector<T, any>>(
        keyOrSelector1: K1
    ): Signal<Resolve<T, K1>>;
    select<K1 extends KeyOrSelector<T, any>, K2 extends KeyOrSelector<Resolve<T, K1>, any>>(
        keyOrSelector1: K1, keyOrSelector2: K2
    ): Signal<Resolve<Resolve<T, K1>, K2>>;
    select<K1 extends KeyOrSelector<T, any>, K2 extends KeyOrSelector<Resolve<T, K1>, any>, K3 extends KeyOrSelector<Resolve<Resolve<T, K1>, K2>, any>>(
        keyOrSelector1: K1, keyOrSelector2: K2, keyOrSelector3: K3
    ): Signal<Resolve<Resolve<Resolve<T, K1>, K2>, K3>>;
    select<K1 extends KeyOrSelector<T, any>, K2 extends KeyOrSelector<Resolve<T, K1>, any>, K3 extends KeyOrSelector<Resolve<Resolve<T, K1>, K2>, any>, K4 extends KeyOrSelector<Resolve<Resolve<Resolve<T, K1>, K2>, K3>, any>>(
        keyOrSelector1: K1, keyOrSelector2: K2, keyOrSelector3: K3, keyOrSelector4: K4
    ): Signal<Resolve<Resolve<Resolve<Resolve<T, K1>, K2>, K3>, K4>>;
    select<R>(...keysAndSelectors: (keyof any | Selector<any, any>)[]): Signal<R>;
    
    /**
     * Link the current signal to another signal
     * @param signal The signal to link to
     * @param pipe A function that transforms the value of the linked signal
     * @returns A function that unlinks the signals
     * @example
     * const counter = signal(0);
     * const doubledCounter = signal(0);
     * counter.link(doubledCounter, value => value * 2);
     * counter.subscribe(value => console.log(value));
     * doubledCounter.subscribe(value => console.log(value)); 
     * counter.setValue(1);
     * // console logs:
     * // > 1
     * // > 2
     */
    link<L = T>(signal: Signal<L>, pipe?: (value: L) => T): () => void;
    readonly linkedSubscriptions: (() => void)[];
}

interface RememberPreviousValueSignalCapabilities<T> {
    previousValue: T | undefined;
}

interface CallableSignal<T> {
    (): T;
}

interface Signal<T = unknown> extends 
    CoreSignalCapabilities<T>, 
    EnhancedSignalCapabilities<T>, 
    RememberPreviousValueSignalCapabilities<T>,
    StaleSignalCapabilities,
    CallableSignal<T> {
}


export type CreateSignalFn= <T>(value: T, options?: SignalOptions<T>) => [Signal<T>, Signal<T>["setValue"]];


// ***** Utility types *****

/**
 * Extracts the type of the value of a Signal
 * @example 
 * type SignalNumber = Signal<number>;
 * type Number = ExtractSignalType<SignalNumber>; // number
 */
type ExtractSignalType<T> = T extends Signal<infer U> ? U : never;

/**
 * Converts an object type to a type where all properties are either the original type or a Signal of the original type
 * Convert a non object type to a type that is either the original type or a Signal of the original type
 * @example
 * type Object = { a: number, b: string };
 * type SignalizedObject = Signalize<Object>; // { a: Signal<number> | number, b: Signal<string> | string }
 * @example 
 * type NumberOrSignal = Signalize<number>; // Signal<number> | number
 */
type Signalize  <T> =  T extends object ? {
    [P in keyof T]: T[P] | Signal<T[P]>;
} : (Signal<T> | T);

/**
 * Unwrap a Signal type to its original type
 * If the input is an object, it will unwrap all properties that are Signals
 * @example
 * type Object = { a: Signal<number>, b: Signal<string> };
 * type UnsignalizedObject = Unsignalize<Object>; // { a: number, b: string }
 * @example
 * type NumberSignal = Signal<number>;
 * type Number = Unsignalize<NumberSignal>; // number
 */
type Unsignalize<T> = T extends object ? {
    [P in keyof T]: T[P] extends Signal<infer U> ? U : T[P];
} : T extends Signal<infer U> ? U : T;

export type { 
    Signal, 
    CoreSignalCapabilities,
    EnhancedSignalCapabilities,
    StaleSignalCapabilities,
    RememberPreviousValueSignalCapabilities,
    SignalOptions,
    CallableSignal,
    Listener, 
    ExtractSignalType, 
    Signalize, 
    Unsignalize 
};
