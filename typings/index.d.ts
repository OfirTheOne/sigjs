import type * as CSS from 'csstype';
import type { Trackable } from "@sigjs/signal";

declare global {

  export namespace Sig {
    export type ClassList = Array<Trackable<unknown> | string | string[] | Record<string, boolean | Trackable<unknown>>>;

  }
  export namespace JSX {

    type NativeElement = globalThis.Element;
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface CSSProperties extends CSS.Properties<string | number> {
      /**
       * enable to add properties to this interface.
       */
    }

    export type SigEvent<T = NativeElement> = Event & { target: T; }
    export type SigEventHandler<T = NativeElement> = (event: SigEvent<T>) => void;
    export type ClipboardEventHandler<T = NativeElement> = (event: ClipboardEvent) => void;
    export type CompositionEventHandler<T = NativeElement> = (event: CompositionEvent) => void;
    export type FocusEventHandler<T = NativeElement> = (event: FocusEvent) => void;
    export type DragEventHandler<T = NativeElement> = (event: DragEvent) => void;
    export type FormEventHandler<T = NativeElement> = (event: SigEvent<T>) => void;
    export type KeyboardEventHandler<T = NativeElement> = (event: KeyboardEvent) => void;
    export type MouseEventHandler<T = NativeElement> = (event: MouseEvent) => void;
    export type TouchEventHandler<T = NativeElement> = (event: TouchEvent) => void;
    export type PointerEventHandler<T = NativeElement> = (event: PointerEvent) => void;
    export type UIEventHandler<T = NativeElement> = (event: UIEvent) => void;
    export type WheelEventHandler<T = NativeElement> = (event: WheelEvent) => void;
    export type AnimationEventHandler<T = NativeElement> = (event: AnimationEvent) => void;
    export type TransitionEventHandler<T = NativeElement> = (event: TransitionEvent) => void;

    interface DOMAttributes<T> {
      // children?: ReactNode;
      dangerouslySetInnerHTML?: {
        __html: string;
      };
      // Clipboard Events
      onCopy?: ClipboardEventHandler<T>;
      onCopyCapture?: ClipboardEventHandler<T>;
      onCut?: ClipboardEventHandler<T>;
      onCutCapture?: ClipboardEventHandler<T>;
      onPaste?: ClipboardEventHandler<T>;
      onPasteCapture?: ClipboardEventHandler<T>;

      // Composition Events
      onCompositionEnd?: CompositionEventHandler<T>;
      onCompositionEndCapture?: CompositionEventHandler<T>;
      onCompositionStart?: CompositionEventHandler<T>;
      onCompositionStartCapture?: CompositionEventHandler<T>;
      onCompositionUpdate?: CompositionEventHandler<T>;
      onCompositionUpdateCapture?: CompositionEventHandler<T>;

      // Focus Events
      onFocus?: FocusEventHandler<T>;
      onFocusCapture?: FocusEventHandler<T>;
      onBlur?: FocusEventHandler<T>;
      onBlurCapture?: FocusEventHandler<T>;

      // Form Events
      onChange?: FormEventHandler<T>;
      onChangeCapture?: FormEventHandler<T>;
      onBeforeInput?: FormEventHandler<T>;
      onBeforeInputCapture?: FormEventHandler<T>;
      onInput?: FormEventHandler<T>;
      onInputCapture?: FormEventHandler<T>;
      onReset?: FormEventHandler<T>;
      onResetCapture?: FormEventHandler<T>;
      onSubmit?: FormEventHandler<T>;
      onSubmitCapture?: FormEventHandler<T>;
      onInvalid?: FormEventHandler<T>;
      onInvalidCapture?: FormEventHandler<T>;

      // Image Events
      onLoad?: SigEventHandler<T>;
      onLoadCapture?: SigEventHandler<T>;
      onError?: SigEventHandler<T>; // also a Media Event
      onErrorCapture?: SigEventHandler<T>; // also a Media Event

      // Keyboard Events
      onKeyDown?: KeyboardEventHandler<T>;
      onKeyDownCapture?: KeyboardEventHandler<T>;
      onKeyPress?: KeyboardEventHandler<T>;
      onKeyPressCapture?: KeyboardEventHandler<T>;
      onKeyUp?: KeyboardEventHandler<T>;
      onKeyUpCapture?: KeyboardEventHandler<T>;

      // Media Events
      onAbort?: SigEventHandler<T>;
      onAbortCapture?: SigEventHandler<T>;
      onCanPlay?: SigEventHandler<T>;
      onCanPlayCapture?: SigEventHandler<T>;
      onCanPlayThrough?: SigEventHandler<T>;
      onCanPlayThroughCapture?: SigEventHandler<T>;
      onDurationChange?: SigEventHandler<T>;
      onDurationChangeCapture?: SigEventHandler<T>;
      onEmptied?: SigEventHandler<T>;
      onEmptiedCapture?: SigEventHandler<T>;
      onEncrypted?: SigEventHandler<T>;
      onEncryptedCapture?: SigEventHandler<T>;
      onEnded?: SigEventHandler<T>;
      onEndedCapture?: SigEventHandler<T>;
      onLoadedData?: SigEventHandler<T>;
      onLoadedDataCapture?: SigEventHandler<T>;
      onLoadedMetadata?: SigEventHandler<T>;
      onLoadedMetadataCapture?: SigEventHandler<T>;
      onLoadStart?: SigEventHandler<T>;
      onLoadStartCapture?: SigEventHandler<T>;
      onPause?: SigEventHandler<T>;
      onPauseCapture?: SigEventHandler<T>;
      onPlay?: SigEventHandler<T>;
      onPlayCapture?: SigEventHandler<T>;
      onPlaying?: SigEventHandler<T>;
      onPlayingCapture?: SigEventHandler<T>;
      onProgress?: SigEventHandler<T>;
      onProgressCapture?: SigEventHandler<T>;
      onRateChange?: SigEventHandler<T>;
      onRateChangeCapture?: SigEventHandler<T>;
      onSeeked?: SigEventHandler<T>;
      onSeekedCapture?: SigEventHandler<T>;
      onSeeking?: SigEventHandler<T>;
      onSeekingCapture?: SigEventHandler<T>;
      onStalled?: SigEventHandler<T>;
      onStalledCapture?: SigEventHandler<T>;
      onSuspend?: SigEventHandler<T>;
      onSuspendCapture?: SigEventHandler<T>;
      onTimeUpdate?: SigEventHandler<T>;
      onTimeUpdateCapture?: SigEventHandler<T>;
      onVolumeChange?: SigEventHandler<T>;
      onVolumeChangeCapture?: SigEventHandler<T>;
      onWaiting?: SigEventHandler<T>;
      onWaitingCapture?: SigEventHandler<T>;

      // MouseEvents
      onAuxClick?: MouseEventHandler<T>;
      onAuxClickCapture?: MouseEventHandler<T>;
      onClick?: MouseEventHandler<T>;
      onClickCapture?: MouseEventHandler<T>;
      onContextMenu?: MouseEventHandler<T>;
      onContextMenuCapture?: MouseEventHandler<T>;
      onDoubleClick?: MouseEventHandler<T>;
      onDoubleClickCapture?: MouseEventHandler<T>;
      onDrag?: DragEventHandler<T>;
      onDragCapture?: DragEventHandler<T>;
      onDragEnd?: DragEventHandler<T>;
      onDragEndCapture?: DragEventHandler<T>;
      onDragEnter?: DragEventHandler<T>;
      onDragEnterCapture?: DragEventHandler<T>;
      onDragExit?: DragEventHandler<T>;
      onDragExitCapture?: DragEventHandler<T>;
      onDragLeave?: DragEventHandler<T>;
      onDragLeaveCapture?: DragEventHandler<T>;
      onDragOver?: DragEventHandler<T>;
      onDragOverCapture?: DragEventHandler<T>;
      onDragStart?: DragEventHandler<T>;
      onDragStartCapture?: DragEventHandler<T>;
      onDrop?: DragEventHandler<T>;
      onDropCapture?: DragEventHandler<T>;
      onMouseDown?: MouseEventHandler<T>;
      onMouseDownCapture?: MouseEventHandler<T>;
      onMouseEnter?: MouseEventHandler<T>;
      onMouseLeave?: MouseEventHandler<T>;
      onMouseMove?: MouseEventHandler<T>;
      onMouseMoveCapture?: MouseEventHandler<T>;
      onMouseOut?: MouseEventHandler<T>;
      onMouseOutCapture?: MouseEventHandler<T>;
      onMouseOver?: MouseEventHandler<T>;

      // Selection Events
      onSelect?: SigEventHandler<T>;
      onSelectCapture?: SigEventHandler<T>;

      // Touch Events
      onTouchCancel?: TouchEventHandler<T>;
      onTouchCancelCapture?: TouchEventHandler<T>;
      onTouchEnd?: TouchEventHandler<T>;
      onTouchEndCapture?: TouchEventHandler<T>;
      onTouchMove?: TouchEventHandler<T>;
      onTouchMoveCapture?: TouchEventHandler<T>;
      onTouchStart?: TouchEventHandler<T>;
      onTouchStartCapture?: TouchEventHandler<T>;

      // Pointer Events
      onPointerDown?: PointerEventHandler<T>;
      onPointerDownCapture?: PointerEventHandler<T>;
      onPointerMove?: PointerEventHandler<T>;
      onPointerMoveCapture?: PointerEventHandler<T>;
      onPointerUp?: PointerEventHandler<T>;
      onPointerUpCapture?: PointerEventHandler<T>;
      onPointerCancel?: PointerEventHandler<T>;
      onPointerCancelCapture?: PointerEventHandler<T>;
      onPointerEnter?: PointerEventHandler<T>;
      onPointerEnterCapture?: PointerEventHandler<T>;
      onPointerLeave?: PointerEventHandler<T>;
      onPointerLeaveCapture?: PointerEventHandler<T>;
      onPointerOver?: PointerEventHandler<T>;
      onPointerOverCapture?: PointerEventHandler<T>;
      onPointerOut?: PointerEventHandler<T>;
      onPointerOutCapture?: PointerEventHandler<T>;
      onGotPointerCapture?: PointerEventHandler<T>;
      onGotPointerCaptureCapture?: PointerEventHandler<T>;
      onLostPointerCapture?: PointerEventHandler<T>;
      onLostPointerCaptureCapture?: PointerEventHandler<T>;

      // UI Events
      onScroll?: UIEventHandler<T>;
      onScrollCapture?: UIEventHandler<T>;

      // Wheel Events
      onWheel?: WheelEventHandler<T>;
      onWheelCapture?: WheelEventHandler<T>;

      // Animation Events
      onAnimationStart?: AnimationEventHandler<T>;
      onAnimationStartCapture?: AnimationEventHandler<T>;
      onAnimationEnd?: AnimationEventHandler<T>;
      onAnimationEndCapture?: AnimationEventHandler<T>;
      onAnimationIteration?: AnimationEventHandler<T>;
      onAnimationIterationCapture?: AnimationEventHandler<T>;

      // Transition Events
      onTransitionEnd?: TransitionEventHandler<T>;
      onTransitionEndCapture?: TransitionEventHandler<T>;

      // Other Events
      onToggle?: SigEventHandler<T>;

      // Global Events
      onToggleCapture?: SigEventHandler<T>;
      onDOMActivate?: SigEventHandler<T>;
      onDOMActivateCapture?: SigEventHandler<T>;
      onDOMFocusIn?: FocusEventHandler<T>;
      onDOMFocusInCapture?: FocusEventHandler<T>;
      onDOMFocusOut?: FocusEventHandler<T>;
      onDOMFocusOutCapture?: FocusEventHandler<T>;
      onDOMAttrModified?: SigEventHandler<T>;
      onDOMAttrModifiedCapture?: SigEventHandler<T>;
      onDOMCharacterDataModified?: SigEventHandler<T>;
      onDOMCharacterDataModifiedCapture?: SigEventHandler<T>;
      onDOMNodeInserted?: SigEventHandler<T>;
      onDOMNodeInsertedCapture?: SigEventHandler<T>;
      onDOMNodeRemoved?: SigEventHandler<T>;
      onDOMNodeRemovedCapture?: SigEventHandler<T>;
      onDOMNodeRemovedFromDocument?: SigEventHandler<T>;
      onDOMNodeRemovedFromDocumentCapture?: SigEventHandler<T>;

    }



    export interface AriaAttributes {
      /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
      'aria-activedescendant'?: string;
      /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
      'aria-atomic'?: boolean | 'false' | 'true';
      /** Indicates whether user input completion suggestions are provided. */
      'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
      /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
      'aria-busy'?: boolean | 'false' | 'true';
      /** Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. */
      'aria-checked'?: boolean | 'false' | 'mixed' | 'true';
      /** Defines the total number of columns in a table, grid, or treegrid. */
      'aria-colcount'?: number;
      /** Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. */
      'aria-colindex'?: number;
      /** Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. */
      'aria-colspan'?: number;
      /** Identifies the element (or elements) whose contents or presence are controlled by the current element. */
      'aria-controls'?: string;
      /** Indicates the element that represents the current item within a container or set of related elements. */
      'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time';
      /** Identifies the element (or elements) that describes the object. */
      'aria-describedby'?: string;
      /** Identifies the element that provides a detailed, extended description for the object. */
      'aria-details'?: string;
      /** Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. */
      'aria-disabled'?: boolean | 'false' | 'true';
      /** Indicates what functions can be performed when a dragged object is released on the drop target. */
      'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup';
      /** Identifies the element that provides an error message for the object. */
      'aria-errormessage'?: string;
      /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
      'aria-expanded'?: boolean | 'false' | 'true';
      /** Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order. */
      'aria-flowto'?: string;
      /** Indicates an element's "grabbed" state in a drag-and-drop operation. */
      'aria-grabbed'?: boolean | 'false' | 'true';
      /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
      'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
      /** Indicates whether the element is exposed to an accessibility API. */
      'aria-hidden'?: boolean | 'false' | 'true';
      /** Indicates the entered value does not conform to the format expected by the application. */
      'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
      /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
      'aria-keyshortcuts'?: string;
      /** Defines a string value that labels the current element. */
      'aria-label'?: string;
      /** Identifies the element (or elements) that labels the current element. */
      'aria-labelledby'?: string;
      /** Defines the hierarchical level of an element within a structure. */
      'aria-level'?: number;
      /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
      'aria-live'?: 'off' | 'assertive' | 'polite';
      /** Indicates whether an element is modal when displayed. */
      'aria-modal'?: boolean | 'false' | 'true';
      /** Indicates whether a text box accepts multiple lines of input or only a single line. */
      'aria-multiline'?: boolean | 'false' | 'true';
      /** Indicates that the user may select more than one item from the current selectable descendants. */
      'aria-multiselectable'?: boolean | 'false' | 'true';
      /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
      'aria-orientation'?: 'horizontal' | 'vertical';
      /** Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. */
      'aria-owns'?: string;
      /** Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. */
      'aria-placeholder'?: string;
      /** Defines an element's number or position in the current set of listitems or treeitems. */
      'aria-posinset'?: number;
      /** Indicates the current "pressed" state of toggle buttons. */
      'aria-pressed'?: boolean | 'false' | 'mixed' | 'true';
      /** Indicates that the element is not editable, but is otherwise operable. */
      'aria-readonly'?: boolean | 'false' | 'true';
      /** Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. */
      'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text';
      /** Indicates that user input is required on the element before a form may be submitted. */
      'aria-required'?: boolean | 'false' | 'true';
      /** Defines a human-readable, author-localized description for the role of an element. */
      'aria-roledescription'?: string;
      /** Defines the total number of rows in a table, grid, or treegrid. */
      'aria-rowcount'?: number;
      /** Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. */
      'aria-rowindex'?: number;
      /** Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. */
      'aria-rowspan'?: number;
      /** Indicates the current "selected" state of various widgets. */
      'aria-selected'?: boolean | 'false' | 'true';
      /** Defines the number of items in the current set of listitems or treeitems. */
      'aria-setsize'?: number;
      /** Indicates the current "sort" status of a column. */
      'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
      /** Defines the maximum allowed value for a range widget. */
      'aria-valuemax'?: number;
      /** Defines the minimum allowed value for a range widget. */
      'aria-valuemin'?: number;
      /** Defines the current value for a range widget. */
      'aria-valuenow'?: number;
      /** Defines the human readable text alternative of aria-valuenow for a range widget. */
      'aria-valuetext'?: string;

      // [key: `aria-${}`]: string | number | boolean | undefined | null;
    }

    interface ComponentAttributes {
      /**
       * Assigns a ref to an element.
       * */
      ref?: any;
    }

    export interface HTMLAttributes<T> extends ComponentAttributes, AriaAttributes, DOMAttributes<T> {
      // Standard HTML Attributes
      accept?: string;
      acceptCharset?: string;
      // accessKey?: string;
      action?: string;
      allowFullScreen?: boolean;
      allowTransparency?: boolean;
      alt?: string;
      as?: string;
      async?: boolean;
      autoComplete?: string;
      autoFocus?: boolean;
      autoPlay?: boolean;
      capture?: boolean | string;
      cellPadding?: number | string;
      cellSpacing?: number | string;
      charSet?: string;
      challenge?: string;
      checked?: boolean;
      cite?: string;
      classID?: string;
      // className?: string;
      cols?: number;
      colSpan?: number;
      content?: string;
      contentEditable?: boolean;
      contextMenu?: string;
      controls?: boolean;
      controlsList?: string;
      coords?: string;
      crossOrigin?: string;
      // data?: string;
      dateTime?: string;
      default?: boolean;
      defer?: boolean;
      dir?: string;
      disabled?: boolean;
      download?: any;
      draggable?: boolean;
      encType?: string;
      form?: string;
      formAction?: string;
      formEncType?: string;
      formMethod?: string;
      formNoValidate?: boolean;
      formTarget?: string;
      frameBorder?: number | string;
      headers?: string;
      height?: number | string;
      hidden?: boolean;
      high?: number;
      href?: string;
      hrefLang?: string;
      htmlFor?: string;
      httpEquiv?: string;
      icon?: string;
      // id?: string;
      // inputMode?: string;
      integrity?: string;
      // is?: string;
      keyParams?: string;
      keyType?: string;
      kind?: string;
      label?: string;
      // lang?: string;
      list?: string;
      loading?: "eager" | "lazy";
      loop?: boolean;
      low?: number;
      manifest?: string;
      marginHeight?: number;
      marginWidth?: number;
      max?: number | string;
      maxLength?: number;
      media?: string;
      mediaGroup?: string;
      method?: string;
      min?: number | string;
      minLength?: number;
      multiple?: boolean;
      muted?: boolean;
      // name?: string;
      nonce?: string;
      noValidate?: boolean;
      open?: boolean;
      optimum?: number;
      pattern?: string;
      placeholder?: string;
      playsInline?: boolean;
      poster?: string;
      preload?: string;
      profile?: string;
      radioGroup?: string;
      readOnly?: boolean;
      referrerPolicy?: string;
      rel?: string;
      required?: boolean;
      reversed?: boolean;
      // role?: string;
      rows?: number;
      rowSpan?: number;
      sandbox?: string;
      scope?: string;
      scoped?: boolean;
      scrolling?: string;
      seamless?: boolean;
      selected?: boolean;
      shape?: string;
      size?: number;
      sizes?: string;
      // slot?: string;
      span?: number;
      spellCheck?: boolean;
      src?: string;
      srcDoc?: string;
      srcLang?: string;
      srcSet?: string;
      start?: number;
      step?: number | string;
      // style?: CSSProperties;
      summary?: string;
      // tabIndex?: number;
      target?: string;
      // title?: string;
      // Setting `type` to an enum is not allowed.
      // Use `inputType` instead.
      type?: string;
      typemustmatch?: boolean;
      useMap?: string;
      // value?: string | string[] | number;
      width?: number | string;
      wmode?: string;
      wrap?: string;

      // RDFa Attributes
      about?: string;
      datatype?: string;
      inlist?: any;
      prefix?: string;
      property?: string;
      resource?: string;
      typeof?: string;
      vocab?: string;

      // Non-standard Attributes
      autoCapitalize?: string;
      autoCorrect?: string;
      autoSave?: string;
      color?: string;
      itemProp?: string;
      itemScope?: boolean;
      itemType?: string;
      itemID?: string;
      itemRef?: string;
      results?: number;
      security?: string;
      unselectable?: "on" | "off";

      // Living Standard
      /**
       * Hints at the type of data that might be entered by the user while editing the element or its contents.
       * */
      inputMode?: string;
      /**
       * Specify that a standard HTML element should behave like a defined custom built-in element
       * */
      is?: string;
      /**
       * Defines a keyboard shortcut for the element.
       * */
      accessKey?: string;
      /**
       * Assigns a slot in a shadow DOM shadow tree to an element.
       * */
      slot?: string;
      /**
       * Assigns a CSS class to an element.
       * */
      className?: string;
      /**
       * Assigns a CSS class to an element.
       * */
      'class:list'?: Sig.ClassList;
      /**
       * Assigns a CSS class to an element.
       * */
      class?: string;
      /**
       * Assigns a CSS style to an element.
       * */
      style?: CSSProperties;
      /**
       * Assigns a unique identifier to an element.
       * */
      id?: string;
      /**
       * Assigns a name to an element.
       * */
      name?: string;
      /**
       * Assigns a value to an element.
       * */
      value?: string | string[] | number;
      /**
       * Assigns a language to an element.
       * */
      lang?: string;
      /**
       * Assigns a title to an element.
       * */
      title?: string;
      /**
       * Assigns a role to an element.
       * */
      role?: string;
      /**
       * Assigns a data-* attribute to an element.
       * */
      data?: any;
      /**
       * Assigns a tabIndex to an element.
       * */
      tabIndex?: number;
      /**
       * Assigns an aria-* attribute to an element.
       * */
      aria?: any;
    }

    type DOMFactory<P extends DOMAttributes<T>, T extends Element> =
      (props?: ComponentAttributes<T> & P | null, ...children: Element[]) => DOMElement<P, T>;

    interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element> extends Element<P, string>, ComponentAttributes {
    }

    export interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      // React-specific Attributes
      suppressHydrationWarning?: boolean | undefined;

      // Attributes which also defined in HTMLAttributes
      // See comment in SVGDOMPropertyConfig.js
      className?: string | undefined;
      color?: string | undefined;
      height?: number | string | undefined;
      id?: string | undefined;
      lang?: string | undefined;
      max?: number | string | undefined;
      media?: string | undefined;
      method?: string | undefined;
      min?: number | string | undefined;
      name?: string | undefined;
      style?: CSSProperties | undefined;
      target?: string | undefined;
      type?: string | undefined;
      width?: number | string | undefined;

      // Other HTML properties supported by SVG elements in browsers
      role?: AriaRole | undefined;
      tabIndex?: number | undefined;
      crossOrigin?: CrossOrigin;

      // SVG Specific attributes
      accentHeight?: number | string | undefined;
      accumulate?: "none" | "sum" | undefined;
      additive?: "replace" | "sum" | undefined;
      alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
      "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
      allowReorder?: "no" | "yes" | undefined;
      alphabetic?: number | string | undefined;
      amplitude?: number | string | undefined;
      arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
      ascent?: number | string | undefined;
      attributeName?: string | undefined;
      attributeType?: string | undefined;
      autoReverse?: Booleanish | undefined;
      azimuth?: number | string | undefined;
      baseFrequency?: number | string | undefined;
      baselineShift?: number | string | undefined;
      baseProfile?: number | string | undefined;
      bbox?: number | string | undefined;
      begin?: number | string | undefined;
      bias?: number | string | undefined;
      by?: number | string | undefined;
      calcMode?: number | string | undefined;
      capHeight?: number | string | undefined;
      clip?: number | string | undefined;
      clipPath?: string | undefined;
      clipPathUnits?: number | string | undefined;
      clipRule?: number | string | undefined;
      colorInterpolation?: number | string | undefined;
      colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
      colorProfile?: number | string | undefined;
      colorRendering?: number | string | undefined;
      contentScriptType?: number | string | undefined;
      contentStyleType?: number | string | undefined;
      cursor?: number | string | undefined;
      cx?: number | string | undefined;
      cy?: number | string | undefined;
      d?: string | undefined;
      decelerate?: number | string | undefined;
      descent?: number | string | undefined;
      diffuseConstant?: number | string | undefined;
      direction?: number | string | undefined;
      display?: number | string | undefined;
      divisor?: number | string | undefined;
      dominantBaseline?: number | string | undefined;
      dur?: number | string | undefined;
      dx?: number | string | undefined;
      dy?: number | string | undefined;
      edgeMode?: number | string | undefined;
      elevation?: number | string | undefined;
      enableBackground?: number | string | undefined;
      end?: number | string | undefined;
      exponent?: number | string | undefined;
      externalResourcesRequired?: Booleanish | undefined;
      fill?: string | undefined;
      fillOpacity?: number | string | undefined;
      fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
      filter?: string | undefined;
      filterRes?: number | string | undefined;
      filterUnits?: number | string | undefined;
      floodColor?: number | string | undefined;
      floodOpacity?: number | string | undefined;
      focusable?: Booleanish | "auto" | undefined;
      fontFamily?: string | undefined;
      fontSize?: number | string | undefined;
      fontSizeAdjust?: number | string | undefined;
      fontStretch?: number | string | undefined;
      fontStyle?: number | string | undefined;
      fontVariant?: number | string | undefined;
      fontWeight?: number | string | undefined;
      format?: number | string | undefined;
      fr?: number | string | undefined;
      from?: number | string | undefined;
      fx?: number | string | undefined;
      fy?: number | string | undefined;
      g1?: number | string | undefined;
      g2?: number | string | undefined;
      glyphName?: number | string | undefined;
      glyphOrientationHorizontal?: number | string | undefined;
      glyphOrientationVertical?: number | string | undefined;
      glyphRef?: number | string | undefined;
      gradientTransform?: string | undefined;
      gradientUnits?: string | undefined;
      hanging?: number | string | undefined;
      horizAdvX?: number | string | undefined;
      horizOriginX?: number | string | undefined;
      href?: string | undefined;
      ideographic?: number | string | undefined;
      imageRendering?: number | string | undefined;
      in2?: number | string | undefined;
      in?: string | undefined;
      intercept?: number | string | undefined;
      k1?: number | string | undefined;
      k2?: number | string | undefined;
      k3?: number | string | undefined;
      k4?: number | string | undefined;
      k?: number | string | undefined;
      kernelMatrix?: number | string | undefined;
      kernelUnitLength?: number | string | undefined;
      kerning?: number | string | undefined;
      keyPoints?: number | string | undefined;
      keySplines?: number | string | undefined;
      keyTimes?: number | string | undefined;
      lengthAdjust?: number | string | undefined;
      letterSpacing?: number | string | undefined;
      lightingColor?: number | string | undefined;
      limitingConeAngle?: number | string | undefined;
      local?: number | string | undefined;
      markerEnd?: string | undefined;
      markerHeight?: number | string | undefined;
      markerMid?: string | undefined;
      markerStart?: string | undefined;
      markerUnits?: number | string | undefined;
      markerWidth?: number | string | undefined;
      mask?: string | undefined;
      maskContentUnits?: number | string | undefined;
      maskUnits?: number | string | undefined;
      mathematical?: number | string | undefined;
      mode?: number | string | undefined;
      numOctaves?: number | string | undefined;
      offset?: number | string | undefined;
      opacity?: number | string | undefined;
      operator?: number | string | undefined;
      order?: number | string | undefined;
      orient?: number | string | undefined;
      orientation?: number | string | undefined;
      origin?: number | string | undefined;
      overflow?: number | string | undefined;
      overlinePosition?: number | string | undefined;
      overlineThickness?: number | string | undefined;
      paintOrder?: number | string | undefined;
      panose1?: number | string | undefined;
      path?: string | undefined;
      pathLength?: number | string | undefined;
      patternContentUnits?: string | undefined;
      patternTransform?: number | string | undefined;
      patternUnits?: string | undefined;
      pointerEvents?: number | string | undefined;
      points?: string | undefined;
      pointsAtX?: number | string | undefined;
      pointsAtY?: number | string | undefined;
      pointsAtZ?: number | string | undefined;
      preserveAlpha?: Booleanish | undefined;
      preserveAspectRatio?: string | undefined;
      primitiveUnits?: number | string | undefined;
      r?: number | string | undefined;
      radius?: number | string | undefined;
      refX?: number | string | undefined;
      refY?: number | string | undefined;
      renderingIntent?: number | string | undefined;
      repeatCount?: number | string | undefined;
      repeatDur?: number | string | undefined;
      requiredExtensions?: number | string | undefined;
      requiredFeatures?: number | string | undefined;
      restart?: number | string | undefined;
      result?: string | undefined;
      rotate?: number | string | undefined;
      rx?: number | string | undefined;
      ry?: number | string | undefined;
      scale?: number | string | undefined;
      seed?: number | string | undefined;
      shapeRendering?: number | string | undefined;
      slope?: number | string | undefined;
      spacing?: number | string | undefined;
      specularConstant?: number | string | undefined;
      specularExponent?: number | string | undefined;
      speed?: number | string | undefined;
      spreadMethod?: string | undefined;
      startOffset?: number | string | undefined;
      stdDeviation?: number | string | undefined;
      stemh?: number | string | undefined;
      stemv?: number | string | undefined;
      stitchTiles?: number | string | undefined;
      stopColor?: string | undefined;
      stopOpacity?: number | string | undefined;
      strikethroughPosition?: number | string | undefined;
      strikethroughThickness?: number | string | undefined;
      string?: number | string | undefined;
      stroke?: string | undefined;
      strokeDasharray?: string | number | undefined;
      strokeDashoffset?: string | number | undefined;
      strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
      strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
      strokeMiterlimit?: number | string | undefined;
      strokeOpacity?: number | string | undefined;
      strokeWidth?: number | string | undefined;
      surfaceScale?: number | string | undefined;
      systemLanguage?: number | string | undefined;
      tableValues?: number | string | undefined;
      targetX?: number | string | undefined;
      targetY?: number | string | undefined;
      textAnchor?: string | undefined;
      textDecoration?: number | string | undefined;
      textLength?: number | string | undefined;
      textRendering?: number | string | undefined;
      to?: number | string | undefined;
      transform?: string | undefined;
      u1?: number | string | undefined;
      u2?: number | string | undefined;
      underlinePosition?: number | string | undefined;
      underlineThickness?: number | string | undefined;
      unicode?: number | string | undefined;
      unicodeBidi?: number | string | undefined;
      unicodeRange?: number | string | undefined;
      unitsPerEm?: number | string | undefined;
      vAlphabetic?: number | string | undefined;
      values?: string | undefined;
      vectorEffect?: number | string | undefined;
      version?: string | undefined;
      vertAdvY?: number | string | undefined;
      vertOriginX?: number | string | undefined;
      vertOriginY?: number | string | undefined;
      vHanging?: number | string | undefined;
      vIdeographic?: number | string | undefined;
      viewBox?: string | undefined;
      viewTarget?: number | string | undefined;
      visibility?: number | string | undefined;
      vMathematical?: number | string | undefined;
      widths?: number | string | undefined;
      wordSpacing?: number | string | undefined;
      writingMode?: number | string | undefined;
      x1?: number | string | undefined;
      x2?: number | string | undefined;
      x?: number | string | undefined;
      xChannelSelector?: string | undefined;
      xHeight?: number | string | undefined;
      xlinkActuate?: string | undefined;
      xlinkArcrole?: string | undefined;
      xlinkHref?: string | undefined;
      xlinkRole?: string | undefined;
      xlinkShow?: string | undefined;
      xlinkTitle?: string | undefined;
      xlinkType?: string | undefined;
      xmlBase?: string | undefined;
      xmlLang?: string | undefined;
      xmlns?: string | undefined;
      xmlnsXlink?: string | undefined;
      xmlSpace?: string | undefined;
      y1?: number | string | undefined;
      y2?: number | string | undefined;
      y?: number | string | undefined;
      yChannelSelector?: string | undefined;
      z?: number | string | undefined;
      zoomAndPan?: string | undefined;
    }

    export interface IntrinsicElements {
      a: HTMLAttributes<HTMLAnchorElement>;
      abbr: HTMLAttributes<unknown>;
      address: HTMLAttributes<unknown>;
      area: HTMLAttributes<unknown>;
      article: HTMLAttributes<unknown>;
      aside: HTMLAttributes<unknown>;
      audio: HTMLAttributes<unknown>;
      b: HTMLAttributes<unknown>;
      base: HTMLAttributes<unknown>;
      bdi: HTMLAttributes<unknown>;
      bdo: HTMLAttributes<unknown>;
      big: HTMLAttributes<unknown>;
      blockquote: HTMLAttributes<unknown>;
      body: HTMLAttributes<unknown>;
      br: HTMLAttributes<unknown>;
      button: HTMLAttributes<HTMLButtonElement>;
      canvas: HTMLAttributes<unknown>;
      caption: HTMLAttributes<unknown>;
      cite: HTMLAttributes<unknown>;
      code: HTMLAttributes<unknown>;
      col: HTMLAttributes<unknown>;
      colgroup: HTMLAttributes<unknown>;
      data: HTMLAttributes<unknown>;
      datalist: HTMLAttributes<unknown>;
      dd: HTMLAttributes<unknown>;
      del: HTMLAttributes<unknown>;
      details: HTMLAttributes<unknown>;
      dfn: HTMLAttributes<unknown>;
      dialog: HTMLAttributes<unknown>;
      div: HTMLAttributes<HTMLDivElement>;
      dl: HTMLAttributes<unknown>;
      dt: HTMLAttributes<unknown>;
      em: HTMLAttributes<unknown>;
      embed: HTMLAttributes<unknown>;
      fieldset: HTMLAttributes<unknown>;
      figcaption: HTMLAttributes<unknown>;
      figure: HTMLAttributes<unknown>;
      footer: HTMLAttributes<unknown>;
      form: HTMLAttributes<HTMLFormElement>;
      h1: HTMLAttributes<HTMLHeadingElement>;
      h2: HTMLAttributes<HTMLHeadingElement>;
      h3: HTMLAttributes<HTMLHeadingElement>;
      h4: HTMLAttributes<HTMLHeadingElement>;
      h5: HTMLAttributes<HTMLHeadingElement>;
      h6: HTMLAttributes<HTMLHeadingElement>;
      head: HTMLAttributes<unknown>;
      header: HTMLAttributes<unknown>;
      hgroup: HTMLAttributes<unknown>;
      hr: HTMLAttributes<unknown>;
      html: HTMLAttributes<unknown>;
      i: HTMLAttributes<unknown>;
      iframe: HTMLAttributes<unknown>;
      img: HTMLAttributes<unknown>;
      input: HTMLAttributes<HTMLInputElement>;
      ins: HTMLAttributes<unknown>;
      kbd: HTMLAttributes<unknown>;
      keygen: HTMLAttributes<unknown>;
      label: HTMLAttributes<HTMLLabelElement>;
      legend: HTMLAttributes<unknown>;
      li: HTMLAttributes<unknown>;
      link: HTMLAttributes<HTMLLinkElement>;
      main: HTMLAttributes<unknown>;
      map: HTMLAttributes<unknown>;
      mark: HTMLAttributes<unknown>;
      menu: HTMLAttributes<unknown>;
      menuitem: HTMLAttributes<unknown>;
      meta: HTMLAttributes<unknown>;
      meter: HTMLAttributes<unknown>;
      nav: HTMLAttributes<unknown>;
      noscript: HTMLAttributes<unknown>;
      object: HTMLAttributes<unknown>;
      ol: HTMLAttributes<unknown>;
      optgroup: HTMLAttributes<unknown>;
      option: HTMLAttributes<HTMLOptionElement>;
      output: HTMLAttributes<unknown>;
      p: HTMLAttributes<HTMLParagraphElement>;
      param: HTMLAttributes<unknown>;
      picture: HTMLAttributes<unknown>;
      pre: HTMLAttributes<unknown>;
      progress: HTMLAttributes<unknown>;
      q: HTMLAttributes<unknown>;
      rp: HTMLAttributes<unknown>;
      rt: HTMLAttributes<unknown>;
      ruby: HTMLAttributes<unknown>;
      s: HTMLAttributes<unknown>;
      samp: HTMLAttributes<unknown>;
      script: HTMLAttributes<unknown>;
      section: HTMLAttributes<unknown>;
      select: HTMLAttributes<HTMLSelectElement>;
      small: HTMLAttributes<unknown>;
      source: HTMLAttributes<unknown>;
      span: HTMLAttributes<unknown>;
      strong: HTMLAttributes<unknown>;
      style: HTMLAttributes<unknown>;
      svg: SVGAttributes<SVGSVGElement>;
      path: SVGAttributes<SVGSVGElement>;
      g: SVGAttributes<SVGSVGElement>;
      sub: HTMLAttributes<unknown>;
      summary: HTMLAttributes<unknown>;
      sup: HTMLAttributes<unknown>;
      table: HTMLAttributes<unknown>;
      tbody: HTMLAttributes<unknown>;
      td: HTMLAttributes<unknown>;
      template: HTMLAttributes<unknown>;
      textarea: HTMLAttributes<unknown>;
      tfoot: HTMLAttributes<unknown>;
      th: HTMLAttributes<unknown>;
      thead: HTMLAttributes<unknown>;
      time: HTMLAttributes<unknown>;
      title: HTMLAttributes<unknown>;
      tr: HTMLAttributes<unknown>;
      track: HTMLAttributes<unknown>;
      u: HTMLAttributes<unknown>;
      ul: HTMLAttributes<unknown>;
      var: HTMLAttributes<unknown>;
      video: HTMLAttributes<unknown>;
      wbr: HTMLAttributes<unknown>;
    }

    export type Element
      = IntrinsicElements
      | string
      | number
      | boolean
      | null
      | undefined
      | (() => (Element | Element[]));

  }
}
export { };