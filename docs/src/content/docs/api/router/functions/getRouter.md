---
editUrl: false
next: false
prev: false
title: "getRouter"
---

> **getRouter**(): [`Router`](/api/router/type-aliases/router/)

Defined in: [router/router.v2.ts:36](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/router/router.v2.ts#L36)

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
