---
editUrl: false
next: false
prev: false
title: "createRouter"
---

> **createRouter**(`config`): `VirtualElement`

Defined in: [router/router.v2.ts:229](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/router/router.v2.ts#L229)

Create a router

## Parameters

### config

[`RouterConfig`](/api/router/type-aliases/routerconfig/)

The router configuration

## Returns

`VirtualElement`

The root router element

using [RouterConfig](/api/api/router/type-aliases/routerconfig/)

## Example

```ts
createRouter({
   routes: [
       { 
           path: '/', component: () => <Layout />,
           children: [
               { index: true, component: () => <Navigate to="/categories" />, memo: false },
               { path: '/categories', component: Categories },
               { path: '/recipes', component: Recipes, memo: false },
               { path: '/recipe/:id', component: Recipe }
           ]
       }
   ]
});
```