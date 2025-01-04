[**sig**](../../README.md)

***

[sig](../../README.md) / [router](../README.md) / getParams

# Function: getParams()

> **getParams**(): `Record`\<`string`, `string`\>

Defined in: [router/router.v2.ts:57](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/router/router.v2.ts#L57)

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
