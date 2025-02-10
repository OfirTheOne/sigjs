import type { Signal } from "@/core/signal";

export interface Comparator<T> {
    (prev: T, next: T): boolean;
}

export interface Selector<T, U> {
    (state: T): U;
}

export interface Middleware<T> {
    (newState: T, state: Partial<T>, store: IStore<T>): void;
}

export interface StoreOptions { }

export interface IStore<T> {
    getState(): T;
    setState(newStateOrSetter: Partial<T> | ((state: T) => Partial<T>)): void;
    select<U>(selector: Selector<T, U>, comparator?: Comparator<U>): Signal<U>;
    subscribe<U>(selector: Selector<T, U>, listener: (value: U) => void, comparator?: Comparator<U>): void;
    notify(): void;
}

/**
 * utility type to infer the state type of a store
 */
export type InferStoreType<T> = T extends IStore<infer U> ? U : never;

/**
 * utility type to extract function properties from an object type
 */
type FunctionProperties<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? K : never]: T[K];
};

export type StoreWithFunctions<T> = IStore<T> & FunctionProperties<T>;



