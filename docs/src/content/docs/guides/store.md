---
title: Store
description: A guide to using the Store class for state management in your application.
banner:
  content: |
    <strong>Note:</strong> The library is in Beta stage.
---

The `Store` class is a powerful tool for managing the state of your application. It holds the state, allows you to update it, and notifies subscribers when the state changes. This guide will walk you through the basics of using the `Store` class, including how to create a store, update the state, and subscribe to state changes.

:::note
The `Store` class relay heavily on signals (from `@sigjs/core` module)  for state updates and subscriptions. 
:::

## Create Store 

`@sigjs` comes with a build in store management module `@sigjs/store`.

By instantiating the `Store` class with an initial state, you create a store instance.

```tsx showLineNumbers=false
const myStore = new Store({ /* ... your state */ });
```


## Defining Your State

There are two approaches to defining your state: 
- be type inferring the state from the initial state object used in the store creation.
- by defining a state interface.

:::note
The state interface is optional, but it's a good practice to define it to have a clear understanding of the state structure.
:::

Let's start with a simple example:

Here's a state definition for a counter (interface approach):

```tsx
interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
}

const createInitialState: CounterState = (store: Store<CounterState>) => ({
    count: 0,
    increment: () => {
        store.setState((state) => ({
            count: state.count + 1
        }));
    },
    decrement: () => {
        store.setState((state) => ({
            count: state.count - 1
        }));
    },
});

```

:::note

In this example, the `createInitialState` function is a factory function that returns the initial state object. It takes the store instance as an argument to allow the state to update the store.
The `Store` constructor supports a factory function for create the initial state object, or the initial state object itself.

```tsx
new Store<T>(
    initialStateOrFactory: (T | ((store: Store<T>) => T)), 
    // ... rest of the options 
): Store<T>

```
:::


## Creating The Store

Now, let's create the store with the initial state:

```tsx
import { Store } from '@sigjs/store';

const counterStore = new Store(createInitialState);

```



## Updating The State
You can update the state using the setState method. This method accepts either a partial state object or a function that returns a partial state object.


```tsx
store.setState({ count: 1 });

// Or using a function
store.setState((state) => ({ count: state.count + 1 }));

```


## Subscribing To State Changes
You can subscribe to state changes using the subscribe method. This method accepts a selector function and a listener function.

```tsx
store.subscribe((state) => state.count, (count) => {
    console.log('Count:', count);
});
```


## Using Selectors

You can use the select method to create a signal for a specific part of the state. This method accepts a selector function and returns a signal.
Additionally, you can pass a comparator function of your own, to the select method to compare the previous and the new state, so changes will be triggered only if the comparator function returns false.


:::note
The comparator function is optional, if not provided, the default comparator function will be used.
the default comparator function is a shallow comparison (`===`) of the previous and the new state.
:::

```tsx
const count$ = store.select((state) => state.count);

count$.subscribe((count) => {
    console.log('Count:', count);
});

```

## Example Usage
Here's a complete example of using the Store class to manage a counter state:

```tsx
import { Store } from '@sigjs/store';

interface CounterState {
    count: number;
    increment: () => void;
    decrement: () => void;
}

const store = new Store<CounterState>({
    count: 0,
    increment: () => {
        store.setState((state) => ({
            count: state.count + 1
        }));
    },
    decrement: () => {
        store.setState((state) => ({
            count: state.count - 1
        }));
    },
});

store.subscribe((state) => state.count, (count) => {
    console.log('From store.subscribe: ', count);
});

const count$ = store.select((state) => state.count);

count$.subscribe((count) => {
    console.log('From count$.select: ', count);
});

store.increment();

store.setState((state) => ({ count: state.count + 1 }));


```

```bash title="Output"
From store.subscribe:  1
From count$.select:  1
From store.subscribe:  2
From count$.select:  2
```

