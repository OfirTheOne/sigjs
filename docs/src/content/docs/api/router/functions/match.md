---
editUrl: false
next: false
prev: false
title: "match"
---

> **match**(`toMatch`, `matchTo`): [`MatchResult`](/api/router/interfaces/matchresult/)

Defined in: [router/match-algorithm/match.ts:30](https://github.com/OfirTheOne/sigjs/blob/ddb97c5d4e7cc6153de1e1e2da19d6ed536582d2/sig/lib/router/match-algorithm/match.ts#L30)

Match the given path to the given route path

## Parameters

### toMatch

`string`

The path to match

### matchTo

`string`

The route path to match against

## Returns

[`MatchResult`](/api/router/interfaces/matchresult/)

The match result

using [MatchResult](/api/api/router/interfaces/matchresult/)

## Example

```ts
match('/user/123/profile', '/user/:id/profile') // { isMatch: true, params: { id: '123' } }
match('/user/123', '/user') // { isMatch: false }
```
