
function isPromise<T = unknown>(obj: unknown): obj is Promise<T>{
    return !!obj 
        && (typeof obj === 'object' || typeof obj === 'function')
        && 'then' in obj
        && typeof obj.then === 'function';
}

export { isPromise }