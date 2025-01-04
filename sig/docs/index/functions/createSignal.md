[**sig**](../../README.md)

***

[sig](../../README.md) / [index](../README.md) / createSignal

# Function: createSignal()

> **createSignal**\<`T`\>(`value`, `options`?): \[`Signal`\<`T`\>, `Signal`\<`T`\>\[`"setValue"`\]\]

Defined in: [core/signal/signal.ts:169](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/core/signal/signal.ts#L169)

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
