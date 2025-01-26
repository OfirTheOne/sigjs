export function reduce(
    fns: ((value: any) => any)[],
) {
    return (value: any) => fns.reduce((acc, fn) => fn(acc), value);
}