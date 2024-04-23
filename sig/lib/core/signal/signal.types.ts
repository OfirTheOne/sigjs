

type Listener<T = unknown> = (value: T) => void;

interface Signal<T = unknown> {
    (): T;
    id: string;
    value: T;
    setValue(value: T | ((value: T) => T)): void;
    emit(value: T): void;
    subscribe(listener: Listener<T>): () => void;
    link<L = T>(signal: Signal<L>, pipe?: (value: L) => T): () => void;
    readonly listeners: Listener<T>[];
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

export type { Signal, Listener, ExtractSignalType, Signalize, Unsignalize };
