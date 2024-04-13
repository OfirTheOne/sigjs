

export interface Comparator<T> {
    (prev: T, next: T): boolean;
}



export function lengthEqual(a: any[], b: any[]): boolean {
    return a.length === b.length;
}

export function deepEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function shallowEqual(a: any, b: any): boolean {
    return a === b;
}