---
editUrl: false
next: false
prev: false
title: "For"
---

> **For**\<`T`\>(`props`): `VirtualElement`

Defined in: core/control-flow/for/index.ts:76

For control flow element

## Type Parameters

• **T** = `unknown`

## Parameters

### props

[`ForProps`](/api/core-index/type-aliases/forprops/)\<`T`\>

For control flow element props

using [ForProps](../../../../../../../api/core-index/type-aliases/forprops)

## Returns

`VirtualElement`

## Example

```ts
<For 
     list={recipes$}
     index={(recipe) => recipe.id}
     factory={(recipe) => <RecipeCard recipe={recipe} />}
 />
```
