[**sig**](../../README.md)

***

[sig](../../README.md) / [index](../README.md) / Unsignalize

# Type Alias: Unsignalize\<T\>

> **Unsignalize**\<`T`\>: `T` *extends* `object` ? `{ [P in keyof T]: T[P] extends Signal<infer U> ? U : T[P] }` : `T` *extends* `Signal`\<infer U\> ? `U` : `T`

Defined in: [core/signal/signal.types.ts:109](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/core/signal/signal.types.ts#L109)

Unwrap a Signal type to its original type
If the input is an object, it will unwrap all properties that are Signals

## Type Parameters

• **T**

## Examples

```ts
type Object = { a: Signal<number>, b: Signal<string> };
type UnsignalizedObject = Unsignalize<Object>; // { a: number, b: string }
```

```ts
type NumberSignal = Signal<number>;
type Number = Unsignalize<NumberSignal>; // number
```
