---
editUrl: false
next: false
prev: false
title: "match"
---

> **match**(`toMatch`, `matchTo`): [`MatchResult`](/api/router/interfaces/matchresult/)

Defined in: [router/match-algorithm/match.ts:30](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/router/match-algorithm/match.ts#L30)

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
