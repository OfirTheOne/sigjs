---
editUrl: false
next: false
prev: false
title: "IfProps"
---

Defined in: [core/control-flow/if/index.ts:20](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L20)

If control flow element props

used in [If](../../../../../../../api/core-index/functions/if)

## Properties

### as?

> `optional` **as**: `string`

Defined in: [core/control-flow/if/index.ts:42](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L42)

The tag of the element to render
if not provided, it will render a custom element with the tag 'if-ph'

***

### asProps?

> `optional` **asProps**: `object`

Defined in: [core/control-flow/if/index.ts:46](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L46)

The props of the element to render

#### Index Signature

\[`key`: `string`\]: `unknown`

***

### condition

> **condition**: `Signal`\<`any`\>

Defined in: [core/control-flow/if/index.ts:24](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L24)

The condition to check

***

### fallback?

> `optional` **fallback**: `Renderable`

Defined in: [core/control-flow/if/index.ts:32](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L32)

The element to render when the condition is false

***

### memo?

> `optional` **memo**: `boolean`

Defined in: [core/control-flow/if/index.ts:37](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L37)

Memoize the elements

#### Default

```ts
true
```

***

### then

> **then**: `Renderable`

Defined in: [core/control-flow/if/index.ts:28](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/core/control-flow/if/index.ts#L28)

The element to render when the condition is true
