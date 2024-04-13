import { Signal, createSignal } from "@/core/signal";
import { Comparator, shallowEqual } from "./comparator";

const defaultComparator = shallowEqual;

interface Selector<T, U> {
    (state: T): U;
}

interface Middleware<T> {
    (newState: T, state: Partial<T>, store: Store<T>): void;
}

export class Store<T> {
    private state: T;
    private signals: Map<Selector<T, unknown>, {
        signal: Signal<unknown>,
        comparator: Comparator<unknown>,
    }> = new Map();
    private middlewares: Middleware<T>[] = [];

    constructor(
        initialState: T, 
        middlewares: Middleware<T>[] = []
    ) {
        this.state = initialState;
        this.middlewares = middlewares;
    }

    getState(): T {
        return this.state;
    }

    setState(newStateOrSetter: Partial<T> | ((state: T) => Partial<T>)){
        const newState = 
            typeof newStateOrSetter === 'function' ? newStateOrSetter(this.state) : newStateOrSetter;
        this.middlewares.forEach(middleware => middleware(this.state, newState, this));
        const updatedState = { ...this.state, ...newState };
        this.state = updatedState;
        this.notify();
    }

    select<U>(selector: Selector<T, U>, comparator?: Comparator<U>): Signal<U> {
        if (!this.signals.has(selector)) {
            const [signal, ] = createSignal<unknown>(selector(this.state), `store-${this.signals.size}`);
            this.signals.set(selector, { 
                signal, 
                comparator: comparator as Comparator<unknown> || defaultComparator
            });
        }
        const { signal } = this.signals.get(selector);
        return signal as Signal<U>;
    }

    subscribe<U>(selector: Selector<T, U>, listener: (value: U) => void, comparator: Comparator<U> = defaultComparator) {
        const signal = this.select(selector, comparator);
        signal.subscribe(listener);
    }

    notify() {
        const newState = this.state;
        this.signals.forEach(({signal, comparator}, selector) => {
            if (comparator(selector(newState), signal.value)) return;
            signal.setValue(selector(newState));
        });
    }
}
