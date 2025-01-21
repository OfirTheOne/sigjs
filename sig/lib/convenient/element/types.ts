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


interface HTMLElementCommonAttributes {
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

export interface HTMLElementAttributes<E = HTMLElement> extends 
    HTMLElementEventHandlers<E>, 
    NonNativeElementAttributes,
    HTMLElementEventHandlersExtendsBasic,
    HTMLElementEventHandlersExtendsConcurrency,
    Signalize<HTMLElementCommonAttributes> {} 

export type AnchorElementAttributes = HTMLElementAttributes<HTMLAnchorElement> & Signalize<{
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
}>;

export type AppletElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type AreaElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type AudioElementAttributes = HTMLElementAttributes<HTMLAudioElement> & Signalize<{
    autoplay: boolean;
    controls: boolean;
    crossorigin: "" | "anonymous" | "use-credentials";
    loop: boolean;
    muted: boolean;
    preload: "" | "none" | "metadata" | "auto";
    src: string;
}>;

export type BaseElementAttributes = HTMLElementAttributes & Signalize<{
    href: string;
    target: string;
}>;

export type BasefontElementAttributes = HTMLElementAttributes & Signalize<{
    color: string;
    face: string;
    size: string;
}>;

export type BlockquoteElementAttributes = HTMLElementAttributes & Signalize<{
    cite: string;
}>;

export type BodyElementAttributes = HTMLElementAttributes<HTMLBodyElement> & Signalize<{
    // Deprecated attributes
    alink?: string;
    background?: string;
    bgcolor?: string;
    link?: string;
    text?: string;
    vlink?: string;
}>;

export type BrElementAttributes = HTMLElementAttributes & Signalize<{
    clear: string;
}>;

export type ButtonElementAttributes = HTMLElementAttributes<HTMLButtonElement> & Signalize<{
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

export type CanvasElementAttributes = HTMLElementAttributes<HTMLCanvasElement> & Signalize<{
    height: number;
    width: number;
}>;

export type CaptionElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type ColElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
    char: string;
    charoff: string;
    span: string;
    valign: string;
    width: string;
}>;

export type ColgroupElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
    char: string;
    charoff: string;
    span: string;
    valign: string;
    width: string;
}>;

export type DataElementAttributes = HTMLElementAttributes & Signalize<{
    value: string;
}>;

export type DelElementAttributes = HTMLElementAttributes & Signalize<{
    cite: string;
    datetime: string;
}>;

export type DetailsElementAttributes = HTMLElementAttributes & Signalize<{
    name: string;
    open: boolean;
}>;

export type DialogElementAttributes = HTMLElementAttributes & Signalize<{
    open: boolean;
    onclose?: (event: Event) => void;
}>;

export type DirElementAttributes = HTMLElementAttributes & Signalize<{
    compact: boolean;
}>;

export type DivElementAttributes = HTMLElementAttributes<HTMLDivElement>;

export type DlElementAttributes = HTMLElementAttributes & Signalize<{
    compact: boolean;
}>;

export type EmbedElementAttributes = HTMLElementAttributes & Signalize<{
    height?: string;
    src?: string;
    type?: string;
    width?: string;
}>;

export type FieldsetElementAttributes = HTMLElementAttributes & Signalize<{
    disabled?: boolean;
    form?: string;
    name?: string;
}>;

export type FontElementAttributes = HTMLElementAttributes & Signalize<{
    color: string;
    face: string;
    size: string;
}>;

export type FormElementAttributes = HTMLElementAttributes<HTMLFormElement> & Signalize<{
    accept?: string;
    'accept-charset'?: string;
    action?: string;
    autocomplete?: string;
    enctype?: string;
    method?: string;
    name?: string;
    novalidate?: boolean;
    target?: string;
}>;

export type FrameElementAttributes = HTMLElementAttributes & Signalize<{
    frameborder: string;
    longdesc: string;
    marginheight: string;
    marginwidth: string;
    name: string;
    noresize: boolean;
    scrolling: string;
    src: string;
}>;

export type FramesetElementAttributes = HTMLElementAttributes & Signalize<{
    cols: string;
    rows: string;
}>;

export type H1ElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type H2ElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type H3ElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type H4ElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type H5ElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type H6ElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
}>;

export type HeadElementAttributes = HTMLElementAttributes & Signalize<{
    profile: string;
}>;

export type HrElementAttributes = HTMLElementAttributes & Signalize<{
    align: string;
    noshade: boolean;
    size: string;
    width: string;
}>;

export type HtmlElementAttributes = HTMLElementAttributes & Signalize<{
    manifest: string;
    version: string;
}>;

export type IframeElementAttributes = HTMLElementAttributes<HTMLIFrameElement> & Signalize<{
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
}>;

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

export type InputElementAttributes = HTMLElementAttributes<HTMLInputElement> & Signalize<{
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
}>;

export type InsElementAttributes = HTMLElementAttributes & Signalize<{
    cite: string;
    datetime: string;
}>;

export type IsindexElementAttributes = HTMLElementAttributes & Signalize<{
    prompt: string;
}>;

export type LabelElementAttributes = HTMLElementAttributes & Signalize<{
    for?: string;
    form?: string;
}>;

export type LegendElementAttributes = HTMLElementAttributes;

export type LiElementAttributes = HTMLElementAttributes & Signalize<{
    // Deprecated attributes
    // type?: string;

    // Attributes
    value?: number;
}>;

export type LinkElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type MapElementAttributes = HTMLElementAttributes & Signalize<{
    name: string;
}>;

export type MenuElementAttributes = HTMLElementAttributes & Signalize<{
    compact: boolean;
}>;

export type MetaElementAttributes = HTMLElementAttributes & Signalize<{
    charset: string;
    content: string;
    'http-equiv': string;
    media: string;
    name: string;
    scheme: string;
}>;

export type MeterElementAttributes = HTMLElementAttributes & Signalize<{
    high?: number;
    low?: number;
    max?: number;
    min?: number;
    optimum?: number;
    value?: number;
}>;

export type ObjectElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type OlElementAttributes = HTMLElementAttributes & Signalize<{
    // Deprecated attributes
    // compact?: boolean;
    // type?: string;

    // Attributes
    reversed?: boolean;
    start?: number;
}>;

export type OptgroupElementAttributes = HTMLElementAttributes & Signalize<{
    disabled?: boolean;
    label?: string;
}>;

export type OptionElementAttributes = HTMLElementAttributes & Signalize<{
    disabled?: boolean;
    label?: string;
    selected?: boolean;
    value?: string;
}>;

export type OutputElementAttributes = HTMLElementAttributes & Signalize<{
    for?: string;
    form?: string;
    name?: string;
}>;

export type PElementAttributes = HTMLElementAttributes;

export type ParamElementAttributes = HTMLElementAttributes & Signalize<{
    name: string;
    value: string;
}>;

export type PreElementAttributes = HTMLElementAttributes & Signalize<{
    width: string;
}>;

export type ProgressElementAttributes = HTMLElementAttributes & Signalize<{
    max?: number;
    value?: number;
}>;

export type QElementAttributes = HTMLElementAttributes & Signalize<{
    cite: string;
}>;

export type ScriptElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type SelectElementAttributes = HTMLElementAttributes & Signalize<{
    autocomplete?: "on" | "off";
    disabled?: boolean;
    form?: string;
    multiple?: boolean;
    name?: string;
    required?: boolean;
    size?: number;
}>;

export type SlotElementAttributes = HTMLElementAttributes & Signalize<{
    name: string;
}>;

export type SourceElementAttributes = HTMLElementAttributes & Signalize<{
    media?: string;
    sizes?: string;
    src?: string;
    srcset?: string;
    type?: string;
}>;

export type StyleElementAttributes = HTMLElementAttributes & Signalize<{
    media?: string;
    type?: string;
}>;

export type TableElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type TbodyElementAttributes = HTMLElementAttributes;

export type TdElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type TemplateElementAttributes = HTMLElementAttributes & Signalize<{
    // No specific attributes for <template>
}>;

export type TextareaElementAttributes = HTMLElementAttributes<HTMLTextAreaElement> & Signalize<{
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
}>;

export type TfootElementAttributes = HTMLElementAttributes;

export type ThElementAttributes = HTMLElementAttributes & Signalize<{
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
}>;

export type TheadElementAttributes = HTMLElementAttributes;

export type TimeElementAttributes = HTMLElementAttributes & Signalize<{
    datetime: string;
}>;

export type TrElementAttributes = HTMLElementAttributes;

export type TrackElementAttributes = HTMLElementAttributes & Signalize<{
    default?: boolean;
    kind?: "subtitles" | "captions" | "descriptions" | "chapters" | "metadata";
    label?: string;
    src: string;
    srclang?: string;
}>;

export type UlElementAttributes = HTMLElementAttributes;

export type VideoElementAttributes = HTMLElementAttributes<HTMLVideoElement> & Signalize<{
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
}>;

export type CustomElementAttributes = HTMLElementAttributes & {
    is: string;
};
