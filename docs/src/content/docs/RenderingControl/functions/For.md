---
editUrl: false
next: false
prev: false
title: "For"
---

> **For**\<`T`\>(`props`): `VirtualElement`

Defined in: [core/control-flow/for/index.ts:62](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/core/control-flow/for/index.ts#L62)

For control flow element

## Type Parameters

• **T** = `unknown`

## Parameters

### props

[`ForProps`](/RenderingControl/interfaces/forprops/)\<`T`\>

For control flow element props

using [ForProps](../../../../../../RenderingControl/interfaces/forprops)

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