---
title: Component Lifecycle
description: Component Lifecycle
banner:
  content: |
    <strong>Note:</strong> The library is in Beta stage.
    
---

A component's lifecycle refers to the stages it goes through from when it is first created to when it is destroyed. Understanding the lifecycle of a component is essential for managing state, side effects, and performance optimization.

### Render Stage
The render stage is responsible for generating the visual representation of a component. During this stage, the component function (equivalent to render method) is called to produce the component's output, typically in the form of a virtual DOM element or similar structure. The render stage accrued only once when the component function is first called. 

:::note
There is no hook for the render stage, as it is the default behavior of the component function.
:::

### Create Stage
The create stage is responsible for processing the component function's output. 
The component's state, signals, and other internal data structures are set up, the component's output is then used to construct an actual DOM element.
This stage is called after the render stage.

```ts
onCreate((ctx: ComponentContext) => {
    // Setup state
    // Setup signals
    // Setup other internal data structures
});

```
### Connect Stage
The connect stage is responsible for attaching the component to the DOM. During this stage, the component's output is added to the DOM tree, and any necessary event listeners or other connections are established. This stage is called after the render stage and before the disconnect stage.

```ts
onConnect((ctx: ComponentContext) => {
    // Add event listeners
    // Establish connections
});
```


### Disconnect Stage 
The disconnect stage is responsible for detaching the component from the DOM. During this stage, the component's output is removed from the DOM tree, and any event listeners or other connections are disconnected. All signals connected to the dom as a result of the component output are paused. This stage is called when the component is unmounted from the DOM.

```ts
onDisconnect((ctx: ComponentContext) => {
    // Remove event listeners
    // Disconnect connections
});
```

### Destroy Stage (memoized component)
TODO: Add description
