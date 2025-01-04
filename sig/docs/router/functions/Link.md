[**sig**](../../README.md)

***

[sig](../../README.md) / [router](../README.md) / Link

# Function: Link()

> **Link**(`__namedParameters`, `children`?): `VirtualElement`

Defined in: [router/link.ts:21](https://github.com/OfirTheOne/sigjs/blob/3813ad713bace85b787cb7296817857283da9a85/sig/lib/router/link.ts#L21)

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

## Example

```ts
<Link to="/categories">Categories</Link> // A link to the categories route
<Link to="/categories" className="link">Categories</Link> // A link to the categories route with a class of link
```
