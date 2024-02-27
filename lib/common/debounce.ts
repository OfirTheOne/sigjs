


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): DebouncedFunction<T> {
    let timeout: number | NodeJS.Timeout;
    return function (this: T, ...args: Parameters<T>) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), ms);
    } as DebouncedFunction<T>;
}

export { debounce };