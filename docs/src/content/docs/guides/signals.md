---
title: Signals
description: Basic guide on signals.
banner:
  content: |
    <strong>Note:</strong> The library is in Beta stage.
    
---

## Introduction To the Basics of Signals

In the context of visual rendering, Signals are a way to represent dynamic content in a component. They are used to update the component's output when the signal value changes with out rerendering (or rerunning) the component.


## What is a Signal ?

Signals are simple subscribable objects that hold a value, that value can be changed over time. When a signal value changes any registered listeners will be notified with the new value. 

:::tip 
Signals are not limited to be used in components, they can be used in any part of your application.
:::

On top of that basic concept, signals can be connected to the DOM elements or attributes, when the signal value changes the connected DOM element or attribute will be updated with the new value.


## Creating a Signal

To create a signal, you can use the `createSignal` function from the `sig` package, for convenience, that function returns a tuple with the signal object and a function to update the signal value.
Its possible to create a signal with the `signal` function as well, that function returns a signal object.

```ts showLineNumbers=false
function createSignal<T>(value: T, options?: SignalOptions): [Signal<T>, Signal<T>["setValue"]]

function signal<T>(value: T, options?: SignalOptions): Signal<T>
```


:::note
Signals are callables objects, that means you can use them as a function to get the current value.
:::

Here is an example of how to create a signal and use it :

```ts

import { createSignal } from 'sig';

const [signal$, setSignal] = createSignal([1, 2, 3]);
console.log(signal$()); // [1, 2, 3]

setSignal([1, 2, 3, 4]);
console.log(signal$()); // [1, 2, 3, 4]

setSignal((prev) => [...prev, 5]);
console.log(signal$()); // [1, 2, 3, 4, 5]

```

```ts
import { signal } from 'sig';

const signal$ = signal([1, 2, 3]);
console.log(signal$()); // [1, 2, 3]

signal$.setValue([1, 2, 3, 4]);
console.log(signal$()); // [1, 2, 3, 4]

signal$.setValue((prev) => [...prev, 5]);
console.log(signal$()); // [1, 2, 3, 4, 5]
```


## Connecting Signals

Signals can be connected to the DOM elements or attributes, when the signal value changes the connected DOM element or attribute will be updated with the new value.


Here is an example of signal connected to a text element and element attribute:

```tsx {"1": 7} {"2": 14} 
import { createSignal } from 'sig';

function App() {
    const [count$, setCount] = createSignal(0);
    const [imageSize$, setImageSize] = createSignal('150');
    return (<div>
        <p>Count: {count$}</p>
        <button 
            onClick={() => {
                setCount(count$() + 1);
                setImageSize(`${Number(imageSize$()) + 10}`);
            }}>Increment</button>
            <img 
                width={imageSize$} height={imageSize$} 
                src="..." 
            />
    </div>);
}
```


`1` - The signal `count$` is connected to the text element, when the signal value changes the text will be updated.

`2` - The signal `imageSize$` is connected to the `width` and `height` attributes of the image element, when the signal value changes the image size will be updated.


:::note
When connecting a signal the DOM element or attribute, don't use the signal as a function, use it as a value. meaning `count$` not `count$()`.
:::


## Signals Reactivity


Lets see a bad example of signal usage:

```tsx {8}
import { createSignal } from 'sig';

function FiveClickButton() {
    const [count$, setCount] = createSignal(0);
    return (<div>
        <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            disabled={count$() >= 5} ❌
            onClick={() => setCount(count$() + 1)}>
            Increment clicks {count$}
        </button>
    </div>);
}
```

Here the signal `count$` is connected correctly to the button text, it will be updated as expected when the signal value changes. 
**But the button `disabled` attribute is not connected to the signal, it simply receives the evaluated value of the expression `count$() >= 5` when the component is first rendered**, (which is `false` in this case), and it will not be updated when the signal value changes. 


To fix this issue, we need to connect the signal to the `disabled` attribute, so the button will be disabled when the signal value is greater than or equal to 5.

```tsx  del={8} ins={9}
import { createSignal } from 'sig';

function FiveClickButton() {
    const [count$, setCount] = createSignal(0);
    return (<div>
        <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            disabled={count$() >= 5}
            disabled={count$.derive((count) => count >= 5)} ✅
            onClick={() => setCount(count$() + 1)}>
            Increment clicks {count$}
        </button>
    </div>);
}
```


:::caution
Using the signal value in an expression directly will not make the expression reactive, the expression will be evaluated only once when the component is first rendered.
This is a common mistake when using signals, the `derive` function should be used to create the reactive expression.
:::