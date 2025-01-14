---
title: Routing
description: A comprehensive guide on routing.
---

## Introduction

Routing is the process of determining which component to display based on the current URL. It is a fundamental part of building single-page applications (SPAs) that have multiple views.

### Router

`sig` provides a build in `Router` module that allows you to define your application's routes and views.
Using the `createRouter` function you create a router component.

Let's start with a simple example:

Here's two pages, `Home` and `About`:
```tsx
function Home() {
    return <div>Home Page !</div>;
}

function About() {
    return <div>About Page !</div>;
}
```

And a common `Layout` component that will be used to wrap the pages:

`1` - `Link` component is used instead of the native `a` tag to navigate using the router.

`2` - `router-outlet` tag is the placeholder where the router will render the matched component.


```tsx {"1":10-11} {"2":16}
import { Link } from "sig/router";
function Layout() {
    return (
        <div className="flex flex-col items-center">
            <nav className="flex gap-4">
                <Link className="border text-blue-500" to="/">App Root</Link>
                <Link className="border text-blue-500" to="/about">About</Link>
                <Link className="border text-blue-500" to="/home">Home</Link>
            </nav>
            <div className="flex flex-col items-center">
                <router-outlet />
            </div>
        </div>
    );
}
```

Now, let's create the router and define the routes:

```tsx 
import { createRouter } from 'sig';
function AppRouter() {
    return createRouter({
        routes: [{
            path: '/', component: Layout,
            children: [
                { path: '/home', component: About }
                { path: '/about', component: About }
            ],
        }]
    });
}
```

Finally, render the `AppRouter` component in the `App` component:

```tsx
function App() {
    return <AppRouter />;
}
```

<!-- ![SimpleRouterApp](../../../assets/SimpleRouterApp_720.gif) -->