---
editUrl: false
next: false
prev: false
title: "IfProps"
---

Defined in: core/control-flow/if/index.ts:22

If control flow element props

used in [If](../../../../../../../api/core-index/functions/if)

## Extends

- `DynamicContainerProps`

## Properties

### as?

> `optional` **as**: `Renderable`

Defined in: core/control-flow/dynamic-container-helper.ts:13

The tag of the element to render
if not provided, it will render a custom element with the tag 'if-ph'

#### Inherited from

`DynamicContainerProps.as`

***

### asProps?

> `optional` **asProps**: `object`

Defined in: core/control-flow/dynamic-container-helper.ts:17

The props of the element to render

#### Index Signature

\[`key`: `string`\]: `unknown`

#### Inherited from

`DynamicContainerProps.asProps`

***

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
