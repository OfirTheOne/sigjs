

type Listener<T = unknown> = (value: T) => void;


interface CoreSignalCapabilities<T> {
    id: string;
    value: T;
    setValue(value: T | ((value: T) => T)): void;
    emit(value: T): void;
    subscribe(listener: Listener<T>): () => void;
    readonly listeners: Listener<T>[];
    disconnect(): void;
}
interface StaleSignalCapabilities {
    enterStaleMode: () => void;
    exitStaleMode: () => void;
}

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
    derive<L = T>(pipe: (value: T) => L): Signal<L>;
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

interface CallableSignal<T> {
    (): T;
}

interface Signal<T = unknown> extends 
    CoreSignalCapabilities<T>, 
    EnhancedSignalCapabilities<T>, 
    StaleSignalCapabilities,
    CallableSignal<T> {
}


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
type Signalize<T> =  T extends object ? {
    [P in keyof T]: T[P] | Signal<T[P]>;
} : (Signal<T> | T);

/**
 * Unwrap a Signal type to its original type
 * If the input is an object, it will unwrap all properties that are Signals
 * @example
 * type Object = { a: Signal<number>, b: Signal<string> };
 * type UnsignalizedObject = Unsignalize<Object>; // { a: number, b: string }
 * @example
 * type NumberOrSignal = Signal<number>;
 * type Number = Unsignalize<NumberOrSignal>; // number
 */
type Unsignalize<T> = T extends object ? {
    [P in keyof T]: T[P] extends Signal<infer U> ? U : T[P];
} : T extends Signal<infer U> ? U : T;

export type { 
    Signal, 
    CoreSignalCapabilities,
    EnhancedSignalCapabilities,
    StaleSignalCapabilities,
    CallableSignal,
    Listener, 
    ExtractSignalType, 
    Signalize, 
    Unsignalize 
};
