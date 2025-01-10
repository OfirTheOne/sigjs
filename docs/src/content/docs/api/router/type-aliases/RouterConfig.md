---
editUrl: false
next: false
prev: false
title: "RouterConfig"
---

> **RouterConfig**: `object`

Defined in: [router/router.type.ts:151](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/router/router.type.ts#L151)

The router configuration object

used in buildRouter

## Type declaration

### base?

> `optional` **base**: `string`

The base path of the router

### ignoreRouterLink?

> `optional` **ignoreRouterLink**: `boolean`

Whether to ignore router links

### ~~layout?~~

> `optional` **layout**: `ComponentFunction`

The layout component of the router

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

### onNoMatch()?

> `optional` **onNoMatch**: () => `void`

The function to call when no match is found

#### Returns

`void`

### routes

> **routes**: [`RouteConfig`](/api/router/type-aliases/routeconfig/) & `object`[]

The routes of the router

### useViewTransition?

> `optional` **useViewTransition**: `boolean`

Whether to use view transitions
