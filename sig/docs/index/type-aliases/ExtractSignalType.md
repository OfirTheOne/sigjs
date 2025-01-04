[**sig**](../../README.md)

***

[sig](../../README.md) / [index](../README.md) / ExtractSignalType

# Type Alias: ExtractSignalType\<T\>

> **ExtractSignalType**\<`T`\>: `T` *extends* `Signal`\<infer U\> ? `U` : `never`

Defined in: [core/signal/signal.types.ts:84](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/core/signal/signal.types.ts#L84)

Extracts the type of the value of a Signal

## Type Parameters

• **T**

## Example

```ts
type SignalNumber = Signal<number>;
type Number = ExtractSignalType<SignalNumber>; // number
```
