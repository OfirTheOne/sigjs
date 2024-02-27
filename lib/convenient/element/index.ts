import { createElement } from "@/core/dom-render/create-element";
import { VirtualElement, VirtualElementChild, Props } from "@/types";
import * as HEA from "./types";
import { debounce } from "@/common/debounce";
import { throttle } from "@/common/throttle";

type ElementWrapper = (
    VirtualElement & 
    { with: (...children: VirtualElement['props']['children']) => VirtualElement }
);

function createWrapper<T>(tagName: string)   {
    return function (props?: Props<T>, ...children: VirtualElementChild[]): ElementWrapper {
        const transformedProps = transformProps(props || {});
        const el = createElement(tagName, transformedProps, ...children);
        el['with'] = function (...children: VirtualElementChild[]) {
            el.props.children = children as VirtualElement['props']['children'];
            return el;
        };
        return el as ElementWrapper;
    };
}

function transformProps<T>(props: Props<T>):Props<T> {

    const stopPropagationExistent = props['stopPropagation'];
    const preventDefaultExistent = props['preventDefault'];
    for(const key in props) {
        const isEvent = typeof props[key] === 'function' && key.startsWith('on');

        if(isEvent && stopPropagationExistent) {
            const eventHandler: ((e: Event) => void) = props[key];
            const wrappedEventHandler = function (this: HTMLElement, e: Event) {
                e?.stopPropagation?.();
                return eventHandler.call(this, e);
            }
            props[key] = wrappedEventHandler
        }

        if(isEvent && preventDefaultExistent) {
            const eventHandler: ((e: Event) => void) = props[key];
            const wrappedEventHandler = function (this: HTMLElement, e: Event) {
                e?.preventDefault?.();
                return eventHandler.call(this, e);
            }
            props[key] = wrappedEventHandler
        }

        if (isEvent && key.includes(':debounce')) {
            if(key.endsWith(':debounce')) {
                const eventName = key.replace(':debounce', '');
                const debouncedEvent = debounce(props[key], 500);
                props[eventName] = debouncedEvent;
            } else {
                const [eventName, debounceTime] = key.split(':debounce:');
                if(Number.isNaN(Number(debounceTime)) || !eventName) {
                    throw new Error('Invalid debounce event');
                }
                const debouncedEvent = debounce(props[key], Number(debounceTime));
                props[eventName] = debouncedEvent;
            }
        } else if (isEvent && key.includes(':throttle')) {
            if(key.endsWith(':throttle')) {
                const eventName = key.replace(':throttle', '');
                const throttledEvent = throttle(props[key], 500);
                props[eventName] = throttledEvent;
            } else {
                const [eventName, throttleTime] = key.split(':throttle:');
                if(Number.isNaN(Number(throttleTime)) || !eventName) {
                    throw new Error('Invalid throttle event');
                }
                const throttledEvent = throttle(props[key], Number(throttleTime));
                props[eventName] = throttledEvent;
            }
        }
    }
    return props;
}

const div = createWrapper<HEA.HTMLElementAttributes>('div');
const p = createWrapper<HEA.HTMLElementAttributes>('p');
const span = createWrapper<HEA.HTMLElementAttributes>('span');
const input = createWrapper<HEA.InputElementAttributes>('input');
const label = createWrapper<HEA.LabelElementAttributes>('label');
const button = createWrapper<HEA.ButtonElementAttributes>('button');
const a = createWrapper<HEA.AnchorElementAttributes>('a');
const table = createWrapper<HEA.HTMLElementAttributes>('table');
const tr = createWrapper<HEA.HTMLElementAttributes>('tr');
const td = createWrapper<HEA.HTMLElementAttributes>('td');
const th = createWrapper<HEA.HTMLElementAttributes>('th');
const tbody = createWrapper<HEA.HTMLElementAttributes>('tbody');
const thead = createWrapper<HEA.HTMLElementAttributes>('thead');
const tfoot = createWrapper<HEA.HTMLElementAttributes>('tfoot');
const ul = createWrapper<HEA.HTMLElementAttributes>('ul');
const li = createWrapper<HEA.HTMLElementAttributes>('li');
const ol = createWrapper<HEA.LiElementAttributes>('ol');
const h1 = createWrapper<HEA.HTMLElementAttributes>('h1');
const h2 = createWrapper<HEA.HTMLElementAttributes>('h2');
const h3 = createWrapper<HEA.HTMLElementAttributes>('h3');
const h4 = createWrapper<HEA.HTMLElementAttributes>('h4');
const h5 = createWrapper<HEA.HTMLElementAttributes>('h5');
const h6 = createWrapper<HEA.HTMLElementAttributes>('h6');
const header = createWrapper<HEA.HTMLElementAttributes>('header');
const footer = createWrapper<HEA.HTMLElementAttributes>('footer');
const nav = createWrapper<HEA.HTMLElementAttributes>('nav');
const main = createWrapper<HEA.HTMLElementAttributes>('main');
const aside = createWrapper<HEA.HTMLElementAttributes>('aside');
const section = createWrapper<HEA.HTMLElementAttributes>('section');
const article = createWrapper<HEA.HTMLElementAttributes>('article');
const form = createWrapper<HEA.FormElementAttributes>('form');
const select = createWrapper<HEA.SelectElementAttributes>('select');
const option = createWrapper<HEA.OptionElementAttributes>('option');
const textarea = createWrapper<HEA.HTMLElementAttributes>('textarea');
const video = createWrapper<HEA.VideoElementAttributes>('video');
const audio = createWrapper<HEA.HTMLElementAttributes>('audio');
const source = createWrapper<HEA.SourceElementAttributes>('source');
const track = createWrapper<HEA.HTMLElementAttributes>('track');
const canvas = createWrapper<HEA.CanvasElementAttributes>('canvas');
const embed = createWrapper<HEA.HTMLElementAttributes>('embed');
const iframe = createWrapper<HEA.IframeElementAttributes>('iframe');
const object = createWrapper<HEA.HTMLElementAttributes>('object');
const param = createWrapper<HEA.HTMLElementAttributes>('param');
const picture = createWrapper<HEA.HTMLElementAttributes>('picture');
const svg = createWrapper<HEA.HTMLElementAttributes>('svg'); // TODO: SVGElementAttributes
const math = createWrapper<HEA.HTMLElementAttributes>('math');
const del = createWrapper<HEA.HTMLElementAttributes>('del');
const img = createWrapper<HEA.ImgElementAttributes>('img');
const ins = createWrapper<HEA.HTMLElementAttributes>('ins');
const caption = createWrapper<HEA.HTMLElementAttributes>('caption');
const col = createWrapper<HEA.HTMLElementAttributes>('col');
const colgroup = createWrapper<HEA.HTMLElementAttributes>('colgroup');
const fieldset = createWrapper<HEA.FieldsetElementAttributes>('fieldset');
const legend = createWrapper<HEA.HTMLElementAttributes>('legend');
const datalist = createWrapper<HEA.HTMLElementAttributes>('datalist');
const optgroup = createWrapper<HEA.HTMLElementAttributes>('optgroup');
const keygen = createWrapper<HEA.HTMLElementAttributes>('keygen');
const output = createWrapper<HEA.HTMLElementAttributes>('output');
const progress = createWrapper<HEA.ProgressElementAttributes>('progress');
const meter = createWrapper<HEA.HTMLElementAttributes>('meter');
const details = createWrapper<HEA.HTMLElementAttributes>('details');
const summary = createWrapper<HEA.HTMLElementAttributes>('summary');
const menuitem = createWrapper<HEA.HTMLElementAttributes>('menuitem');
const menu = createWrapper<HEA.HTMLElementAttributes>('menu');
const dialog = createWrapper<HEA.DialogElementAttributes>('dialog');
const slot = createWrapper<HEA.HTMLElementAttributes>('slot');
const template = createWrapper<HEA.TemplateElementAttributes>('template');

export {
    div,
    p,
    span,
    input,
    label,
    button,
    a,
    table,
    tr,
    td,
    th,
    tbody,
    thead,
    tfoot,
    ul,
    li,
    ol,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    header,
    footer,
    nav,
    main,
    aside,
    section,
    article,
    form,
    select,
    option,
    textarea,
    video,
    audio,
    source,
    track,
    canvas,
    embed,
    iframe,
    object,
    param,
    picture,
    svg,
    math,
    del,
    img,
    ins,
    caption,
    col,
    colgroup,
    fieldset,
    legend,
    datalist,
    optgroup,
    keygen,
    output,
    progress,
    meter,
    details,
    summary,
    menuitem,
    menu,
    dialog,
    slot,
    template,
}