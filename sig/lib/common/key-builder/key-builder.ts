
export interface KeyBuilder {
    key: string;
    toString(): string;
    get(): string[];
    push(...parts: string[]): KeyBuilder;
    pushRoot(): KeyBuilder;
    pushIndex(index: number): KeyBuilder;
    pop(): KeyBuilder;
    shift(): KeyBuilder;
    unshift(...parts: string[]): KeyBuilder;
    clone(): KeyBuilder;
}

export function keyBuilder(key = ''): KeyBuilder {
    const keyParts = key.split('.');
    return {
        get key() {
            return this.toString();
        },
        toString() {
            return keyParts.join('.');
        },
        push(...parts: string[]) {
            keyParts.push(...parts);
            return this;
        },
        pushIndex(index: number) {
            keyParts.push(`[${index.toString()}]`);
            return this;
        },
        pop() {
            keyParts.pop();
            return this;
        },
        shift() {
            keyParts.shift();
            return this;
        },
        unshift(...parts: string[]) {
            keyParts.unshift(...parts);
            return this;
        },
        get() {
            return keyParts;
        },
        clone() {
            return keyBuilder(keyParts.join('.'));
        },
        pushRoot() {
            keyParts.push('$');
            return this;
        },
    };
}