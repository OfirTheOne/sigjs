---
editUrl: false
next: false
prev: false
title: "getParams"
---

> **getParams**(): `Record`\<`string`, `string`\>

Defined in: [router/router.v2.ts:60](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/router/router.v2.ts#L60)

Get the params of the current route

## Returns

`Record`\<`string`, `string`\>

The params of the current route

## Throws

If called outside of a router context

## Example

```ts
// Assume the current route is '/user/1'
// And the route path is defined as '/user/:id',
const params = getParams();
console.log(params);
// console logs:
// > { id: '1' }
```
