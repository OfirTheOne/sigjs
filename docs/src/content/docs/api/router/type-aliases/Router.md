---
editUrl: false
next: false
prev: false
title: "Router"
---

> **Router**: `object`

Defined in: [router/router.type.ts:195](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/router/router.type.ts#L195)

The router object

used in [getRouter](../../../../../../../api/router/functions/getrouter)

## Type declaration

### container

> **container**: `HTMLElement`

The container element of the router

### matchedRouteId

> **matchedRouteId**: `string`

The id of the matched route

### navigate()

> **navigate**: (`path`) => `void`

Navigate to a new route

#### Parameters

##### path

`string`

#### Returns

`void`

### navigateState

> **navigateState**: `object`

The state of the navigation

#### navigateState.isNavigating

> **isNavigating**: `boolean`

### navigationMatchMetadata?

> `optional` **navigationMatchMetadata**: `NavigationMatchMetadata`

The metadata of the matched route

### push()

> **push**: (`path`, `state`?) => `void`

Push a new route

#### Parameters

##### path

`string` | `URL`

##### state?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

### replace()

> **replace**: (`path`, `state`?) => `void`

Replace the current route

#### Parameters

##### path

`string` | `URL`

##### state?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

### rootId

> **rootId**: `string`

The id of the root element

### state

> **state**: `Record`\<`string`, `unknown`\>

The state of the router