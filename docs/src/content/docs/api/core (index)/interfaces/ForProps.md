---
editUrl: false
next: false
prev: false
title: "ForProps"
---

Defined in: [core/control-flow/for/index.ts:18](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L18)

For control flow element props

used in [For](../../../../../../../api/core-index/functions/for)

## Type Parameters

• **T** = `unknown`

## Properties

### as?

> `optional` **as**: `string`

Defined in: [core/control-flow/for/index.ts:39](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L39)

The tag of the element to render
if not provided, it will render a custom element with the tag 'for-ph'

***

### asProps?

> `optional` **asProps**: `object`

Defined in: [core/control-flow/for/index.ts:43](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L43)

The props of the element to render

#### Index Signature

\[`key`: `string`\]: `unknown`

***

### empty?

> `optional` **empty**: `Renderable`

Defined in: [core/control-flow/for/index.ts:34](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L34)

The element to render when the list is empty

***

### factory

> **factory**: `Renderable` \| (`item`, `index`, `list`) => `Renderable`

Defined in: [core/control-flow/for/index.ts:26](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L26)

The factory function to create the elements

***

### index?

> `optional` **index**: `string` \| (`item`, `i`) => `string`

Defined in: [core/control-flow/for/index.ts:30](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L30)

The index of the item

***

### list

> **list**: `T`[] \| `Signal`\<`T`[]\>

Defined in: [core/control-flow/for/index.ts:22](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/for/index.ts#L22)

The list of items to iterate over
