---
editUrl: false
next: false
prev: false
title: "Unsignalize"
---

> **Unsignalize**\<`T`\>: `T` *extends* `object` ? `{ [P in keyof T]: T[P] extends Signal<infer U> ? U : T[P] }` : `T` *extends* `Signal`\<infer U\> ? `U` : `T`

Defined in: [core/signal/signal.types.ts:109](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/core/signal/signal.types.ts#L109)

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