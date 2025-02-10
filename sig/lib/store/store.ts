import { Signal, createSignal } from "@/core/signal";
import { shallowEqual } from "./comparator";
import { Middleware, Selector, StoreOptions, Comparator, IStore, StoreWithFunctions, InferStoreType } from "./types";
import logger from "@/common/logger/logger";

const defaultComparator = shallowEqual;

/**
 * Store is a class that holds the state of the application and notifies subscribers when the state changes.
 * 
 * @example
 * const store = new Store({ count: 0 });
 * store.subscribe(state => console.log(state.count));
 * store.setState({ count: 1 });
 * // console logs:
 * // > 1
 * @example
 * const store = new Store({ count: 0 });
 * const count$ = store.select(state => state.count);
 * count$.subscribe(count => console.log(count));
 * count$.setValue((prevCount) => prevCount + 1);
 * // console logs:
 * // > 1
 */
export class Store<T> implements IStore<T> {
    private state: T;
    private signals: Map<Selector<T, unknown>, {
        signal: Signal<unknown>,
        comparator: Comparator<unknown>,
    }> = new Map();
    private middlewares: Middleware<T>[] = [];

    constructor(
        initialState: T, 
        middlewares: Middleware<T>[] = [],
        _options: StoreOptions<T> = { }
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
            const [signal, ] = createSignal<unknown>(selector(this.state), { id: `store-${this.signals.size}` });
            this.signals.set(selector, { 
                signal, 
                comparator: comparator as Comparator<unknown> || defaultComparator
            });
        }
        const { signal } = this.signals.get(selector) || {};
        if(!signal) {
            throw new Error('Signal not found');
        }
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

    accessStateFunctionsWithStore(): StoreWithFunctions<T> {
        this.#embedStateFunctions();
        return this as unknown as StoreWithFunctions<T>;
    }

    #embedStateFunctions() {
        const initialState = this.state;
        const self: any = this;
        for (const key in initialState) {
            if (typeof initialState[key] === 'function') {
                if(!(key in this)) {
                    self[key] = initialState[key].bind(initialState);
                } else {
                    logger.warn(`Store already has a property named ${key}, skipping embedding function`);
                }
            }
        }
    }
}