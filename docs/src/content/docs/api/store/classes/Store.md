---
editUrl: false
next: false
prev: false
title: "Store"
---

Defined in: store/store.ts:25

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

## Implements

- `IStore`\<`T`\>
