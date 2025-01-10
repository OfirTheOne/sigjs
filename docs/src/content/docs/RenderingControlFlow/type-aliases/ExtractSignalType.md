---
editUrl: false
next: false
prev: false
title: "ExtractSignalType"
---

> **ExtractSignalType**\<`T`\>: `T` *extends* `Signal`\<infer U\> ? `U` : `never`

Defined in: [core/signal/signal.types.ts:84](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/core/signal/signal.types.ts#L84)

Extracts the type of the value of a Signal

## Type Parameters

• **T**

## Example

```ts
type SignalNumber = Signal<number>;
type Number = ExtractSignalType<SignalNumber>; // number
```
