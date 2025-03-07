---
editUrl: false
next: false
prev: false
title: "IfProps"
---

Defined in: core/control-flow/if/index.ts:22

If control flow element props

used in [If](../../../../../../../api/core-index/functions/if)

## Properties

### condition

> **condition**: `Signal`\<`any`\>

Defined in: core/control-flow/if/index.ts:26

The condition to check

***

### fallback?

> `optional` **fallback**: `Renderable`

Defined in: core/control-flow/if/index.ts:34

The element to render when the condition is false

***

### memo?

> `optional` **memo**: `boolean`

Defined in: core/control-flow/if/index.ts:39

Memoize the elements

#### Default

```ts
true
```

***

### then

> **then**: `Renderable`

Defined in: core/control-flow/if/index.ts:30

The element to render when the condition is true
