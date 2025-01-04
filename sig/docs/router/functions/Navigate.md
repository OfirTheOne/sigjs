[**sig**](../../README.md)

***

[sig](../../README.md) / [router](../README.md) / Navigate

# Function: Navigate()

> **Navigate**(`props`): `VirtualElement`

Defined in: [router/navigate.ts:20](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/router/navigate.ts#L20)

Navigate to a new route

## Parameters

### props

`NavigateProps`

The props of the component

## Returns

`VirtualElement`

## Throws

If being called outside of a router context

## Example

```ts
<Navigate to="/categories" /> // Navigate to the categories route using push
<Navigate to="/categories" replace /> // Navigate to the categories route using replace
```
