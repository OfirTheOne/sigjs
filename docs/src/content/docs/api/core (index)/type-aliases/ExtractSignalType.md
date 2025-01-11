---
editUrl: false
next: false
prev: false
title: "ExtractSignalType"
---

> **ExtractSignalType**\<`T`\>: `T` *extends* `Signal`\<infer U\> ? `U` : `never`

Defined in: [core/signal/signal.types.ts:84](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/signal/signal.types.ts#L84)

Extracts the type of the value of a Signal

## Type Parameters

• **T**

## Example

```ts
type SignalNumber = Signal<number>;
type Number = ExtractSignalType<SignalNumber>; // number
```
