---
editUrl: false
next: false
prev: false
title: "ExtractSignalType"
---

> **ExtractSignalType**\<`T`\>: `T` *extends* `Signal`\<infer U\> ? `U` : `never`

Defined in: core/signal/signal.types.ts:84

Extracts the type of the value of a Signal

## Type Parameters

• **T**

## Example

```ts
type SignalNumber = Signal<number>;
type Number = ExtractSignalType<SignalNumber>; // number
```
