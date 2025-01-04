[**sig**](../../README.md)

***

[sig](../../README.md) / [index](../README.md) / Signalize

# Type Alias: Signalize\<T\>

> **Signalize**\<`T`\>: `T` *extends* `object` ? \{ \[P in keyof T\]: T\[P\] \| Signal\<T\[P\]\> \} : `Signal`\<`T`\> \| `T`

Defined in: [core/signal/signal.types.ts:95](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/core/signal/signal.types.ts#L95)

Converts an object type to a type where all properties are either the original type or a Signal of the original type
Convert a non object type to a type that is either the original type or a Signal of the original type

## Type Parameters

• **T**

## Examples

```ts
type Object = { a: number, b: string };
type SignalizedObject = Signalize<Object>; // { a: Signal<number> | number, b: Signal<string> | string }
```

```ts
type NumberOrSignal = Signalize<number>; // Signal<number> | number
```
