---
editUrl: false
next: false
prev: false
title: "getRouter"
---

> **getRouter**(): [`Router`](/api/router/type-aliases/router/)

Defined in: router/router.v2.ts:36

Get the current router instance

## Returns

[`Router`](/api/router/type-aliases/router/)

The current router instance, must be called within a router context

## Throws

If called outside of a router context  

using [Router](../../../../../../../api/router/type-aliases/router)

## Example

```ts
const router = getRouter();
console.log(router);
// console logs:
// > { container: HTMLElement, push: Function, replace: Function, navigate: Function, ... }
```
