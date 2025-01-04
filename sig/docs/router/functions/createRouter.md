[**sig**](../../README.md)

***

[sig](../../README.md) / [router](../README.md) / createRouter

# Function: createRouter()

> **createRouter**(`config`): `VirtualElement`

Defined in: [router/router.v2.ts:224](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/router/router.v2.ts#L224)

Create a router

## Parameters

### config

`RouterConfig`

The router configuration

## Returns

`VirtualElement`

The root router element

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
