---
editUrl: false
next: false
prev: false
title: "ForProps"
---

> **ForProps**\<`T`\>: `object`

Defined in: core/control-flow/for/index.ts:43

For control flow element props

used in [For](../../../../../../../api/core-index/functions/for)

## Type Parameters

• **T** = `unknown`

## Type declaration

### empty?

> `optional` **empty**: `Renderable`

The element to render when the list is empty

### factory()

> **factory**: (`args`) => `Renderable`

The factory function to create the elements

#### Parameters

##### args

`ForFactory`\<`T`\>

#### Returns

`Renderable`

### index?

> `optional` **index**: `string` \| (`item`, `i`) => `string`

The index of the item

### list

> **list**: `Signal`\<`T`[]\>

The list of items to iterate over

### memo?

> `optional` **memo**: `boolean`
