---
editUrl: false
next: false
prev: false
title: "Store"
---

Defined in: [store/store.ts:31](https://github.com/OfirTheOne/sigjs/blob/990f9c2a70d38ca041cbd102a37f74a99eedb608/sig/lib/store/store.ts#L31)

Store is a class that holds the state of the application and notifies subscribers when the state changes.

## Examples

```ts
const store = new Store({ count: 0 });
store.subscribe(state => console.log(state.count));
store.setState({ count: 1 });
// console logs:
// > 1
```

```ts
const store = new Store({ count: 0 });
const count$ = store.select(state => state.count);
count$.subscribe(count => console.log(count));
count$.setValue((prevCount) => prevCount + 1);
// console logs:
// > 1
```

## Type Parameters

• **T**
