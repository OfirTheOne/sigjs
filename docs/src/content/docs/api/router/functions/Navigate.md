---
editUrl: false
next: false
prev: false
title: "Navigate"
---

> **Navigate**(`props`): `VirtualElement`

Defined in: [router/navigate.ts:22](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/router/navigate.ts#L22)

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
