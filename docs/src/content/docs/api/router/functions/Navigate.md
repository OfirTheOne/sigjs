---
editUrl: false
next: false
prev: false
title: "Navigate"
---

> **Navigate**(`props`): `VirtualElement`

Defined in: router/navigate.ts:22

Navigate to a new route

## Parameters

### props

`NavigateProps`

The props of the component

## Returns

`VirtualElement`

## Throws

If being called outside of a router context

using NavigateProps

## Example

```ts
<Navigate to="/categories" /> // Navigate to the categories route using push
<Navigate to="/categories" replace /> // Navigate to the categories route using replace
```
