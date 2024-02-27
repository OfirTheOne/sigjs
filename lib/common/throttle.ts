

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle<T extends (...args: any[]) => any>(fn: T, ms: number): ThrottledFunction<T> {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last < ms) {
            return;
        }
        last = now;
        return fn(...args);
    };
}

export { throttle };