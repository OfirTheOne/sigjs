---
editUrl: false
next: false
prev: false
title: "For"
---

> **For**\<`T`\>(`props`): `VirtualElement`

Defined in: core/control-flow/for/index.ts:62

For control flow element

## Type Parameters

• **T** = `unknown`

## Parameters

### props

[`ForProps`](/api/core-index/interfaces/forprops/)\<`T`\>

For control flow element props

using [ForProps](../../../../../../../api/core-index/interfaces/forprops)

## Returns

`VirtualElement`

## Example

```ts
<For 
     as='div'
     asProps={{ className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }} 
     list={recipes$}
     index={(recipe) => recipe.id}
     factory={(recipe) => <RecipeCard recipe={recipe} />}
 />
```
