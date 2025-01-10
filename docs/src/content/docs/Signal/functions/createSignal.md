---
editUrl: false
next: false
prev: false
title: "createSignal"
---

> **createSignal**\<`T`\>(`value`, `options`?): \[`Signal`\<`T`\>, `Signal`\<`T`\>\[`"setValue"`\]\]

Defined in: [signal.ts:169](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/core/signal/signal.ts#L169)

Create a signal and a function to set the value of the signal

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

\[`Signal`\<`T`\>, `Signal`\<`T`\>\[`"setValue"`\]\]

A tuple containing the signal and a function to set the value of the signal
