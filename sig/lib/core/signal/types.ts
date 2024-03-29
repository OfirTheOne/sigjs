

type Listener<T = unknown> = (value: T) => void;

interface Signal<T = unknown> {
    (): T;
    id: string;
    value: T;
    setValue(value: T | ((value: T) => T)): void;
    subscribe(listener: Listener<T>): () => void;
    link<L = T>(signal: Signal<L>, pipe?: (value: L) => T): () => void;
    readonly listeners: Listener<T>[];
}

export type { Signal, Listener };
