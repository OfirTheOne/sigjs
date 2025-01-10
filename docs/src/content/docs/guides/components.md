---
title: Components
description: A comprehensive guide on using components in your library.

---

## Introduction

Components are the building blocks of your application. They encapsulate logic, structure, and styling, making it easier to manage and reuse code. 

## Usage

You build components by composing together html tags or other components tags.
You can pass props & children as arguments for a component.


### Rendering

An "instance" of a component is being rendered only once, (instance refers to a appearance in the DOM tree), unless it was unmount from the DOM then it being constructed once again there for "run" again.
Changes in signals received from outside or created inside the component do not causing rerendering.

```tsx
import { createSignal, Signal } from 'sig';

interface MyButtonComponentProps {
  count$: Signal<number>; 
  onClick: () => void;
}

function MyButtonComponent(props: MyButtonComponentProps) {
    console.log('MyButtonComponent render');

    return (
        <button 
            onClick={props.onClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md">
        Click count {props.count$}
        </button>
    );
}

export function App() {
    const [clickCount$, setClickCount] = createSignal(0);

    return (
        <div className={'flex flex-col items-center justify-center h-screen'}>
            <MyButtonComponent 
                count$={clickCount$} 
                onClick={() => setClickCount((count) => count + 1)} 
            />
        </div>
    );
}

```

Heres the `MyButtonComponents` screen record showing ui changes & interactivity without rerendering.

![alt text](../../../assets/MyButtonComponent_480.gif)


