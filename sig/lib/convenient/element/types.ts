import type { Signal, Signalize } from '@/core/signal/signal.types';
import type * as CSS from 'csstype';


type CSSProperties = CSS.Properties<string | number>

export interface HTMLElementEventHandlers<E = HTMLElement> {
    onAbort?: (event: UIEvent) => void;
    onAnimationEnd?: (event: AnimationEvent) => void;
    onAnimationIteration?: (event: AnimationEvent) => void;
    onAnimationStart?: (event: AnimationEvent) => void;
    onAuxClick?: (event: MouseEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onCanPlay?: (event: Event) => void;
    onCanPlayThrough?: (event: Event) => void;
    onChange?: (event: Event & { target: E; }) => void;
    onClick?: (event: MouseEvent) => void;
    onContextMenu?: (event: MouseEvent) => void;
    onCopy?: (event: ClipboardEvent) => void;
    onCut?: (event: ClipboardEvent) => void;
    onDoubleClick?: (event: MouseEvent) => void;
    onDrag?: (event: DragEvent) => void;
    onDragEnd?: (event: DragEvent) => void;
    onDragEnter?: (event: DragEvent) => void;
    onDragExit?: (event: DragEvent) => void;
    onDragLeave?: (event: DragEvent) => void;
    onDragOver?: (event: DragEvent) => void;
    onDragStart?: (event: DragEvent) => void;
    onDrop?: (event: DragEvent) => void;
    onDurationChange?: (event: Event) => void;
    onEmptied?: (event: Event) => void;
    onEnded?: (event: Event) => void;
    onError?: (event: ErrorEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onInput?: (event: InputEvent & { target: E }) => void;
    onInvalid?: (event: Event) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyPress?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
    onLoad?: (event: Event) => void;
    onLoadedData?: (event: Event) => void;
    onLoadedMetadata?: (event: Event) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseOut?: (event: MouseEvent) => void;
    onMouseOver?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onPaste?: (event: ClipboardEvent) => void;
    onPause?: (event: Event) => void;
    onPlay?: (event: Event) => void;
    onPlaying?: (event: Event) => void;
    onProgress?: (event: ProgressEvent) => void;
    onRateChange?: (event: Event) => void;
    onReset?: (event: Event) => void;
    onResize?: (event: UIEvent) => void;
    onScroll?: (event: UIEvent) => void;
    onSeeked?: (event: Event) => void;
    onSeeking?: (event: Event) => void;
    onSelect?: (event: Event) => void;
    onSubmit?: (event: Event) => void;
    onTransitionEnd?: (event: TransitionEvent) => void;
    onVolumeChange?: (event: Event) => void;
    onWaiting?: (event: Event) => void;
    onWheel?: (event: WheelEvent) => void;
}

export type HTMLElementEventHandlersExtendsBasic = {
    stopPropagation?: boolean;
    preventDefault?: boolean;
}
    
export type HTMLElementEventHandlersExtendsConcurrency = {
    [K in keyof HTMLElementEventHandlers as
    `${K}:debounce:${number}`
    | `${K}:debounce`
    | `${K}:throttle:${number}`
    | `${K}:throttle`]: HTMLElementEventHandlers[K];
};

interface NonNativeElementAttributes {
    ref?: any;
    className?: string | Signal<string> | (Signal<string> | string)[] | Record<string, boolean> ;
    style?: Signalize<CSSProperties> | Signal<CSSProperties>;
}

export interface HTMLElementAttributes<E = HTMLElement> extends 
    HTMLElementEventHandlers<E>, 
    NonNativeElementAttributes,
    HTMLElementEventHandlersExtendsBasic,
    HTMLElementEventHandlersExtendsConcurrency {
    accesskey?: string;
    autocapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
    autofocus?: boolean;
    class?: string;
    contenteditable?: "true" | "false" | "inherit";
    dir?: 'ltr' | 'rtl' | 'auto';
    draggable?: "true" | "false" | "auto";
    enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
    hidden?: boolean;
    id?: string;
    inert?: boolean;
    inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    is?: string;
    itemid?: string;
    itemprop?: string;
    itemref?: string;
    itemscope?: boolean;
    itemtype?: string;
    lang?: string;
    nonce?: string;
    popover?: string;
    slot?: string;
    spellcheck?: boolean;
    tabindex?: number;
    title?: string;
    translate?: 'yes' | 'no';
}

export interface AnchorElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // charset?: string;
    // coords?: string;
    // rev?: string;
    // shape?: string;

    // Attributes
    download?: string;
    href?: string;
    hreflang?: string;
    name?: string;
    ping?: string;
    referrerpolicy?: "" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    rel?: string;
    target?: "_self" | "_blank" | "_parent" | "_top" | string;
    type?: string;
}

export interface AppletElementAttributes extends HTMLElementAttributes {
    align: string;
    alt: string;
    archive: string;
    code: string;
    codebase: string;
    height: string;
    hspace: string;
    name: string;
    object: string;
    vspace: string;
    width: string;
}

export interface AreaElementAttributes extends HTMLElementAttributes {
    alt: string;
    coords: string;
    download: string;
    href: string;
    hreflang: string;
    nohref: boolean;
    ping: string;
    referrerpolicy: string;
    rel: string;
    shape: string;
    target: string;
    type: string;
}

export interface AudioElementAttributes extends HTMLElementAttributes {
    autoplay: boolean;
    controls: boolean;
    crossorigin: "" | "anonymous" | "use-credentials";
    loop: boolean;
    muted: boolean;
    preload: "" | "none" | "metadata" | "auto";
    src: string;
}

export interface BaseElementAttributes extends HTMLElementAttributes {
    href: string;
    target: string;
}

export interface BasefontElementAttributes extends HTMLElementAttributes {
    color: string;
    face: string;
    size: string;
}

export interface BlockquoteElementAttributes extends HTMLElementAttributes {
    cite: string;
}

export interface BodyElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    alink?: string;
    background?: string;
    bgcolor?: string;
    link?: string;
    text?: string;
    vlink?: string;
}

export interface BrElementAttributes extends HTMLElementAttributes {
    clear: string;
}

export type ButtonElementAttributes = HTMLElementAttributes & Signalize<{
    disabled?: boolean;
    form?: string;
    formaction?: string;
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    formmethod?: "get" | "post" | "dialog";
    formnovalidate?: boolean;
    formtarget?: "_self" | "_blank" | "_parent" | "_top" | string;
    name?: string;
    type?: "submit" | "reset" | "button";
    value?: string;
    // Custom attributes
    popovertarget?: string;
    popovertargetaction?: string;
}>;

export interface CanvasElementAttributes extends HTMLElementAttributes {
    height: number;
    width: number;
}

export interface CaptionElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface ColElementAttributes extends HTMLElementAttributes {
    align: string;
    char: string;
    charoff: string;
    span: string;
    valign: string;
    width: string;
}

export interface ColgroupElementAttributes extends HTMLElementAttributes {
    align: string;
    char: string;
    charoff: string;
    span: string;
    valign: string;
    width: string;
}

export interface DataElementAttributes extends HTMLElementAttributes {
    value: string;
}

export interface DelElementAttributes extends HTMLElementAttributes {
    cite: string;
    datetime: string;
}

export interface DetailsElementAttributes extends HTMLElementAttributes {
    name: string;
    open: boolean;
}

export interface DialogElementAttributes extends HTMLElementAttributes {
    open: boolean;
    onclose?: (event: Event) => void;
}

export interface DirElementAttributes extends HTMLElementAttributes {
    compact: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DivElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
}

export interface DlElementAttributes extends HTMLElementAttributes {
    compact: boolean;
}

export interface EmbedElementAttributes extends HTMLElementAttributes {
    height?: string;
    src?: string;
    type?: string;
    width?: string;
}

export interface FieldsetElementAttributes extends HTMLElementAttributes {
    disabled?: boolean;
    form?: string;
    name?: string;
}

export interface FontElementAttributes extends HTMLElementAttributes {
    color: string;
    face: string;
    size: string;
}

export interface FormElementAttributes extends HTMLElementAttributes {
    accept?: string;
    'accept-charset'?: string;
    action?: string;
    autocomplete?: string;
    enctype?: string;
    method?: string;
    name?: string;
    novalidate?: boolean;
    target?: string;
}

export interface FrameElementAttributes extends HTMLElementAttributes {
    frameborder: string;
    longdesc: string;
    marginheight: string;
    marginwidth: string;
    name: string;
    noresize: boolean;
    scrolling: string;
    src: string;
}

export interface FramesetElementAttributes extends HTMLElementAttributes {
    cols: string;
    rows: string;
}

export interface H1ElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface H2ElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface H3ElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface H4ElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface H5ElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface H6ElementAttributes extends HTMLElementAttributes {
    align: string;
}

export interface HeadElementAttributes extends HTMLElementAttributes {
    profile: string;
}

export interface HrElementAttributes extends HTMLElementAttributes {
    align: string;
    noshade: boolean;
    size: string;
    width: string;
}

export interface HtmlElementAttributes extends HTMLElementAttributes {
    manifest: string;
    version: string;
}

export interface IframeElementAttributes extends HTMLElementAttributes {
    allow?: string;
    allowfullscreen?: boolean;
    allowpaymentrequest?: boolean;
    allowusermedia?: boolean;
    frameborder?: "0" | "1";
    height?: string;
    loading?: "eager" | "lazy";
    longdesc?: string;
    marginheight?: string;
    marginwidth?: string;
    name?: string;
    referrerpolicy?: "" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    sandbox?: string;
    scrolling?: "yes" | "no" | "auto";
    src?: string;
    srcdoc?: string;
    width?: string;
}

export type ImgElementAttributes = HTMLElementAttributes & Signalize<{
    alt: string;
    crossorigin?: "anonymous" | "use-credentials";
    decoding?: "sync" | "async" | "auto";
    height?: string;
    ismap?: boolean;
    loading?: "eager" | "lazy";
    longdesc?: string;
    name?: string;
    referrerpolicy?: "" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    sizes?: string;
    src: string;
    srcset?: string;
    usemap?: string;
    width?: string;
}>;

export interface InputElementAttributes extends HTMLElementAttributes<HTMLInputElement> {
    accept?: string;
    alt?: string;
    autocomplete?: "on" | "off";
    checked?: boolean;
    dirname?: string;
    disabled?: boolean;
    form?: string;
    formaction?: string;
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    formmethod?: "get" | "post" | "dialog";
    formnovalidate?: boolean;
    formtarget?: "_self" | "_blank" | "_parent" | "_top";
    height?: string;
    list?: string;
    max?: string;
    maxlength?: number;
    min?: string;
    minlength?: number;
    multiple?: boolean;
    name?: string;
    pattern?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: string;
    type?: "button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";
    value?: string;
    width?: string;
}

export interface InsElementAttributes extends HTMLElementAttributes {
    cite: string;
    datetime: string;
}

export interface IsindexElementAttributes extends HTMLElementAttributes {
    prompt: string;
}

export interface LabelElementAttributes extends HTMLElementAttributes {
    for?: string;
    form?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LegendElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
}

export interface LiElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // type?: string;

    // Attributes
    value?: number;
}

export interface LinkElementAttributes extends HTMLElementAttributes {
    as?: "audio" | "document" | "embed" | "fetch" | "font" | "image" | "object" | "script" | "style" | "track" | "video" | "worker";
    charset?: string;
    color?: string;
    crossorigin?: "anonymous" | "use-credentials";
    disabled?: boolean;
    href?: string;
    hreflang?: string;
    imagesizes?: string;
    imagesrcset?: string;
    integrity?: string;
    media?: string;
    referrerpolicy?: "" | "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    rel?: "alternate" | "author" | "dns-prefetch" | "help" | "license" | "next" | "pingback" | "preconnect" | "prefetch" | "preload" | "prerender" | "prev" | "search" | "stylesheet";
    sizes?: string;
    type?: string;
}

export interface MapElementAttributes extends HTMLElementAttributes {
    name: string;
}

export interface MenuElementAttributes extends HTMLElementAttributes {
    compact: boolean;
}

export interface MetaElementAttributes extends HTMLElementAttributes {
    charset: string;
    content: string;
    'http-equiv': string;
    media: string;
    name: string;
    scheme: string;
}

export interface MeterElementAttributes extends HTMLElementAttributes {
    high?: number;
    low?: number;
    max?: number;
    min?: number;
    optimum?: number;
    value?: number;
}

export interface ObjectElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
    // archive?: string;
    // border?: string;
    // classid?: string;
    // codebase?: string;
    // codetype?: string;
    // hspace?: string;
    // vspace?: string;

    // Attributes
    data?: string;
    declare?: boolean;
    form?: string;
    height?: string;
    name?: string;
    standby?: string;
    type?: string;
    typemustmatch?: boolean;
    usemap?: string;
    width?: string;
}

export interface OlElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // compact?: boolean;
    // type?: string;

    // Attributes
    reversed?: boolean;
    start?: number;
}

export interface OptgroupElementAttributes extends HTMLElementAttributes {
    disabled?: boolean;
    label?: string;
}

export interface OptionElementAttributes extends HTMLElementAttributes {
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string;
}

export interface OutputElementAttributes extends HTMLElementAttributes {
    for?: string;
    form?: string;
    name?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
}

export interface ParamElementAttributes extends HTMLElementAttributes {
    name: string;
    value: string;
}

export interface PreElementAttributes extends HTMLElementAttributes {
    width: string;
}

export interface ProgressElementAttributes extends HTMLElementAttributes {
    max?: number;
    value?: number;
}

export interface QElementAttributes extends HTMLElementAttributes {
    cite: string;
}

export interface ScriptElementAttributes extends HTMLElementAttributes {
    async?: boolean;
    // blocking: boolean; // Not a standard attribute
    charset?: string;
    crossorigin?: "anonymous" | "use-credentials";
    defer?: boolean;
    // fetchpriority: string; // Not a standard attribute
    integrity?: string;
    // language: string; // Deprecated in HTML5
    nomodule?: boolean;
    referrerpolicy?: string;
    src?: string;
    type?: string;
}

export interface SelectElementAttributes extends HTMLElementAttributes {
    autocomplete?: "on" | "off";
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
}

export interface SlotElementAttributes extends HTMLElementAttributes {
    name: string;
}

export interface SourceElementAttributes extends HTMLElementAttributes {
    media?: string;
    sizes?: string;
    src?: string;
    srcset?: string;
    type?: string;
}

export interface StyleElementAttributes extends HTMLElementAttributes {
    media?: string;
    type?: string;
}

export interface TableElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
    // bgcolor?: string;
    // border?: string;
    // cellpadding?: string;
    // cellspacing?: string;
    // frame?: string;
    // rules?: string;
    // summary?: string;
    // width?: string;

    // Modern attributes
    'aria-describedby'?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TbodyElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
    // char?: string;
    // charoff?: string;
    // valign?: string;
}

export interface TdElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // abbr?: string;
    // align?: string;
    // axis?: string;
    // bgcolor?: string;
    // char?: string;
    // charoff?: string;
    // colspan?: string;
    // rowspan?: string;
    // scope?: string;
    // valign?: string;
    // width?: string;
    // nowrap?: boolean;

    // Modern attributes
    headers?: string;
    height?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TemplateElementAttributes extends HTMLElementAttributes {
    // No specific attributes for <template>
}

export interface TextareaElementAttributes extends HTMLElementAttributes<HTMLTextAreaElement> {
    autocomplete?: "on" | "off";
    cols?: number;
    value?: string;
    dirname?: string;
    disabled?: boolean;
    form?: string;
    maxlength?: number;
    minlength?: number;
    name?: string;
    placeholder?: string;
    readonly?: boolean;
    required?: boolean;
    rows?: number;
    wrap?: "hard" | "soft";
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TfootElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
    // char?: string;
    // charoff?: string;
    // valign?: string;
}

export interface ThElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // abbr?: string;
    // align?: string;
    // axis?: string;
    // bgcolor?: string;
    // char?: string;
    // charoff?: string;
    // colspan?: string;
    // rowspan?: string;
    // scope?: string;
    // valign?: string;
    // width?: string;
    // nowrap?: boolean;

    // Modern attributes
    headers?: string;
    height?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TheadElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
    // char?: string;
    // charoff?: string;
    // valign?: string;
}

export interface TimeElementAttributes extends HTMLElementAttributes {
    datetime: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TrElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // align?: string;
    // bgcolor?: string;
    // char?: string;
    // charoff?: string;
    // valign?: string;
}

export interface TrackElementAttributes extends HTMLElementAttributes {
    default?: boolean;
    kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
    label?: string;
    src: string;
    srclang?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UlElementAttributes extends HTMLElementAttributes {
    // Deprecated attributes
    // compact?: boolean;
    // type?: string;
}

export interface VideoElementAttributes extends HTMLElementAttributes {
    autoplay?: boolean;
    controls?: boolean;
    crossorigin?: "anonymous" | "use-credentials";
    height?: number;
    loop?: boolean;
    muted?: boolean;
    playsinline?: boolean;
    poster?: string;
    preload?: "none" | "metadata" | "auto";
    src?: string;
    width?: number;
}

export interface CustomElementAttributes extends HTMLElementAttributes {
    is: string;
}
