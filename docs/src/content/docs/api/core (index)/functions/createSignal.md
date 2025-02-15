---
editUrl: false
next: false
prev: false
title: "createSignal"
---

> **createSignal**\<`T`\>(`value`, `options`?): \[`Signal`\<`T`\>, (`value`) => `void`\]

Defined in: core/signal/signal.ts:219

Create a signal and a function to set the value of the signal

## Type Parameters

• **T**

## Parameters

### value

`T`

The initial value of the signal

### options?

`SignalOptions`\<`T`\>

Options for the signal

## Returns

\[`Signal`\<`T`\>, (`value`) => `void`\]

A tuple containing the signal and a function to set the value of the signal
