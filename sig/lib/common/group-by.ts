export function groupBy<T, K extends string>(arr: T[], keyFn: (item: T) => K): Record<K, T[]> {
    return arr.reduce((acc, obj) => {
        const groupKey = keyFn(obj);
        if (acc[groupKey]) {
            acc[groupKey].push(obj);
        } else {
            acc[groupKey] = [obj];
        }
        return acc;
    }, {} as Record<K, T[]>);
}
