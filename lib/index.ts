
type VirtualElementChild = VirtualElement | Signal<any> | string | number | boolean | null | undefined ;

interface VirtualElement {
    type: string;
    props: {
        [key: string]: unknown;
        children: VirtualElement[];
    };
}

type Listener<T = unknown> = (value: T) => void;

interface Signal<T = unknown> {
    (): T;
    value: T;
    subscribe(listener: Listener<T>): () => void;
    link(signal: Signal<T>): () => void;
    readonly listeners: Listener<T>[];
}

function createSignal<T>(value: T): [Signal<T>, (value: T) => void] {
    let listeners: Listener<T>[] = [];
    const nonCallableSignal: Pick<Signal<T>, 'link' | 'listeners' | 'subscribe' | 'value'> = {
        get value() {
            return value;
        },
        set value(newValue: T) {
            value = newValue;
            listeners.forEach(listener => listener(value));
        },
        subscribe(listener: Listener<T>) {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        },
        link(signal: Signal<T>) {
            return signal.subscribe((value) => {
                this.value = value;
            });
        },
        get listeners() {
            return listeners;
        }
    };
    const callableSignal = function(this: Signal<T>) {
        return this.value;
    };
    Object.defineProperty(callableSignal, 'value', {
        get() {
            return nonCallableSignal.value;
        },
        set(newValue: T) {
            nonCallableSignal.value = newValue;
        }
    });
    Object.defineProperty(callableSignal, 'listeners', {
        get() {
            return nonCallableSignal.listeners;
        }
    });
    callableSignal.subscribe = nonCallableSignal.subscribe;
    callableSignal.link = nonCallableSignal.link;
    return [callableSignal as Signal<T>, (newValue: T) => nonCallableSignal.value = newValue];
}

function isSignal<T = unknown>(value: unknown): value is Signal<T> {
    return typeof value === 'function' && typeof (value as Signal<T>).subscribe === 'function';
}

function subscribeSignal<T = unknown>(signal: Signal<T>, callback: Listener<T>): () => void {
    let lastValue: T = signal.value;
    const unsubscribe = signal.subscribe((value) => {
        lastValue = value;
        callback(value);
    });
    callback(lastValue);
    return unsubscribe;
}

function createTextElement(text: string): VirtualElement {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    };
}

function createSignalElement<T = unknown>(signal: Signal<T>): VirtualElement {
    return {
        type: 'SIGNAL_ELEMENT',
        props: {
            signal,
            children: []
        }
    };
}

function createEmptyElement(): VirtualElement { 
    return {
        type: 'EMPTY_ELEMENT',
        props: {
            children: []
        }
    };
}

function adaptVirtualElementChild(child: VirtualElementChild): VirtualElement {
    switch (true) {
        case isSignal(child):
            return createSignalElement(child);
        case typeof child === 'object':
            return child;
        case typeof child === 'string':
        case typeof child === 'number':
        case typeof child === 'boolean':
            return createTextElement(String(child));
        case child === null:
        case child === undefined:
            return createEmptyElement();
        default:
            throw new Error(`Invalid child type: ${typeof child}`);
    }
}

function createElement(type: string, props: object, ...children: VirtualElementChild[]): VirtualElement {
    return {
        type,
        props: {
            ...props,
            children: children.map(adaptVirtualElementChild)
        }
    };
}

function render(element: VirtualElement, container: HTMLElement): unknown {
    switch (element.type) {
        case 'TEXT_ELEMENT':
            return renderText(element.props.nodeValue as string, container);
        case 'SIGNAL_ELEMENT':
            renderSignal(element.props.signal as Signal, container);
            return container;
        case 'EMPTY_ELEMENT':
            return container;
        default:
            return renderElement(element, container);
    }
}

function renderElement(element: VirtualElement, container: HTMLElement): unknown {
    const isProperty = (key: string) => key !== 'children';

    const dom = document.createElement(element.type);
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            attachPropertyToElement(dom, name, element.props[name]);
        });

    element.props.children.forEach(child => render(child, dom));

    container.appendChild(dom);
    return dom;
}

function renderText(text: string, container: HTMLElement): unknown {
    const dom = document.createTextNode(text);
    container.appendChild(dom);
    return dom;
}

function renderSignal<T = unknown>(signal: Signal<T>, container: HTMLElement): unknown {
    const dom = document.createTextNode(signal.value as string);
    container.appendChild(dom);
    return subscribeSignal(signal, (value: unknown) => {
        dom.nodeValue = value as string;
    });
}

function attachPropertyToElement(dom: HTMLElement, name: string, value: unknown): unknown {
    if (name === 'children') {
        return;
    }
    if (name === 'className') {
        name = 'class';
    }
    if (isSignal(value)) {
        return attachSignalToElement(value, dom, name);
    }
    if (typeof value === 'function') {
        attachEventToElement(dom, name, value);
    } else {
        attachAttributeToElement(dom, name, value);
    }
}

function attachAttributeToElement(dom: HTMLElement, name: string, value: unknown): void {
    if (value) {
        dom.setAttribute(name, value as string);
    } else {
        dom.removeAttribute(name);
    }
}

function attachEventToElement(dom: HTMLElement, name: string, value: unknown): void {
    if(!name.startsWith('on')) {
        throw new Error(`Event name must start with 'on'`);
    }
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, value as EventListener);
}

function attachSignalToElement<T = unknown>(
    signal: Signal<T>, 
    element: HTMLElement, 
    property: string
): unknown {
    return subscribeSignal(signal, (value: unknown) => {
        attachPropertyToElement(element, property, value);
    });
}

function createRoot(domElement: HTMLElement): { render: (element: VirtualElement) => void } {
    return {
        render(element: VirtualElement) {
            render(element, domElement);
        }
    };
}

export type {
    VirtualElement,
    Signal
};

export {
    createRoot,
    createSignal,
    isSignal,
    subscribeSignal,
    createElement,
    render,
    attachPropertyToElement
};