---
editUrl: false
next: false
prev: false
title: "ForProps"
---

> **ForProps**\<`T`\>: \{ `factory`: (`item`, `index`, `list`, `itemSignal`) => `Renderable`; `provideItemSignal`: `true`; \} \| \{ `factory`: (`item`, `index`, `list`) => `Renderable`; `provideItemSignal`: `false`; \} & `object` & `DynamicContainerProps`

Defined in: core/control-flow/for/index.ts:20

For control flow element props

used in [For](../../../../../../../api/core-index/functions/for)

## Type declaration

### empty?

> `optional` **empty**: `Renderable`

The element to render when the list is empty

### index?

> `optional` **index**: `string` \| (`item`, `i`) => `string`

The index of the item

### list

> **list**: `Signal`\<`T`[]\>

The list of items to iterate over

### memo?

> `optional` **memo**: `boolean`

## Type Parameters

• **T** = `unknown`
