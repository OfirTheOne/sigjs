---
editUrl: false
next: false
prev: false
title: "IfProps"
---

Defined in: core/control-flow/if/index.ts:20

If control flow element props

used in [If](../../../../../../../api/core-index/functions/if)

## Properties

### as?

> `optional` **as**: `string`

Defined in: core/control-flow/if/index.ts:42

The tag of the element to render
if not provided, it will render a custom element with the tag 'if-ph'

***

### asProps?

> `optional` **asProps**: `object`

Defined in: core/control-flow/if/index.ts:46

The props of the element to render

#### Index Signature

\[`key`: `string`\]: `unknown`

***

### condition

> **condition**: `Signal`\<`any`\>

Defined in: core/control-flow/if/index.ts:24

The condition to check

***

### fallback?

> `optional` **fallback**: `Renderable`

Defined in: core/control-flow/if/index.ts:32

The element to render when the condition is false

***

### memo?

> `optional` **memo**: `boolean`

Defined in: core/control-flow/if/index.ts:37

Memoize the elements

#### Default

```ts
true
```

***

### then

> **then**: `Renderable`

Defined in: core/control-flow/if/index.ts:28

The element to render when the condition is true
