---
editUrl: false
next: false
prev: false
title: "signal"
---

> **signal**\<`T`\>(`value`, `options`?): `Signal`\<`T`\>

Defined in: [signal.ts:116](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/core/signal/signal.ts#L116)

Create a signal

## Type Parameters

• **T**

## Parameters

### value

`T`

The initial value of the signal

### options?

`SignalOptions`

Options for the signal

## Returns

`Signal`\<`T`\>

A signal

## Examples

```ts
const counter = signal(0);
counter.subscribe(value => console.log(value));
counter.setValue(1);
counter.setValue((prevValue) => prevValue + 1);
// console logs:
// > 0
// > 1
// > 2
```

```ts
const counter = signal(0, { id: 'counter' });
console.log(counter.id);
// > 'counter'
```

```ts
const counter = signal(0, { rememberPrevValue: true });
console.log(counter.previousValue);
counter.setValue(1);
console.log(counter.previousValue);
// console logs:
// > undefined
// > 0
```
