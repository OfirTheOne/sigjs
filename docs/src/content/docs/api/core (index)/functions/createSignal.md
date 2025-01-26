---
editUrl: false
next: false
prev: false
title: "createSignal"
---

> **createSignal**\<`T`\>(`value`, `options`?): \[`Signal`\<`T`\>, `Signal`\<`T`\>\[`"setValue"`\]\]

Defined in: core/signal/signal.ts:183

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
