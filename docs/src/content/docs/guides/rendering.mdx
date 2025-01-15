---
title: Rendering
description: Basic guide on rendering behavior. 

---


## Introduction

Rendering is the process of generating the visual representation of a component. It is the primary responsibility of a component to produce the output that will be displayed on the screen.


Displaying component content can be done by using the component as a tag in the JSX syntax, or by calling the component function directly in a curly braces `{}` inside another component's output.

---

## Supported Primitive Rendered Values

:::note[Rendering primitive values]
Rendering primitive values refer to placing values in curly braces `{}` inside the component's output. e.g. `{value}`.
:::

#### Components can render the following types of values:

- **String**: Rendered as text content.
- **Number**: Rendered as text content.
- **Boolean**: Rendered as text content.
- **Null or Undefined**: Rendered as empty content. 
- **Signal**: Rendered as dynamic content.
- **Element**: Html or SVG elements are rendered as they are.



### Rendering `String`, `Number`, `Boolean`

Strings, numbers, and booleans are rendered as text content.
There being simply covered to string before rendering.

```tsx
function MyComponent() {
    return (<div>
        { 'Hello World' }
        { 42 }
        { true }
    </div>);
}
```

The output of the component will be:

```html
<div>
    Hello World
    42
    true
</div>
```

### Rendering `null` or `undefined`

Null or undefined values are rendered as empty content.

```tsx
function MyComponent() {
    return (<div>
        { null }
        { undefined }
    </div>);
}
```

The output of the component will be:

```html
<div></div>
```

### Rendering Signal

Signals are used to represent dynamic content. When a signal value changes, the dom element or attribute that is connected to the signal will be updated.

```tsx
import { createSignal } from 'sig';

function MyComponent() {
    const [count$, setCount] = createSignal(0);

    return (<div>
        { count$ }
        <button onClick={() => setCount(count$ + 1)}>Increment</button>
    </div>);
}
```

The output of the component will be:

```html
<div>
    0
    <button>Increment</button>
</div>
```

When the button is clicked, the signal value will be updated, and the component will be rerendered with the new value.

### Rendering Element

Html or SVG elements are rendered as they are.

```tsx

import { buildMyElement } from 'some-external-library';
import MySvgIcon from './MySvgIcon';

const myHtmlElement: HTMLElement = buildMyElement();

function MyComponent() {
    return (<div>
        <h1>Hello World</h1>
        { myHtmlElement }
        { MySvgIcon() }
    </div>);
}
```

The output of the component will be:

```html
<div>
    <h1>Hello World</h1>
    <div>...</div> <!-- this is myHtmlElement -->
    <svg>...</svg> <!-- this is MySvgIcon -->
</div>
```

---

:::caution
Rendering an object (other then signal) or an array will result in an error.
Error `Uncaught Error: Invalid child element` will be thrown.
:::