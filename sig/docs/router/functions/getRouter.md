[**sig**](../../README.md)

***

[sig](../../README.md) / [router](../README.md) / getRouter

# Function: getRouter()

> **getRouter**(): `Router`

Defined in: [router/router.v2.ts:33](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/router/router.v2.ts#L33)

Get the current router instance

## Returns

`Router`

The current router instance, must be called within a router context

## Throws

If called outside of a router context

## Example

```ts
const router = getRouter();
console.log(router);
// console logs:
// > { container: HTMLElement, push: Function, replace: Function, navigate: Function, ... }
```
