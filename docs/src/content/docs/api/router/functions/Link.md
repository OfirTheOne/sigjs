---
editUrl: false
next: false
prev: false
title: "Link"
---

> **Link**(`__namedParameters`, `children`?): `VirtualElement`

Defined in: [router/link.ts:23](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/router/link.ts#L23)

A link component that navigates using the app router, preventing the default behavior.
Anchor elements resulting from this component will have the class 'router-link'.

## Parameters

### \_\_namedParameters

`LinkProps`

### children?

`any`

## Returns

`VirtualElement`

## Throws

If being called outside of a router context

using LinkProps

## Example

```ts
<Link to="/categories">Categories</Link> // A link to the categories route
<Link to="/categories" className="link">Categories</Link> // A link to the categories route with a class of link
```