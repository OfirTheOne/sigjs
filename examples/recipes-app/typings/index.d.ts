import type * as CSS from 'csstype';
import type { VirtualElement } from "sig/types";
import type * as HEA from "sig/convenient";

declare global {
  export namespace JSX {


    type Booleanish = boolean | 'true' | 'false';

    type NativeElement = globalThis.Element;
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface CSSProperties extends CSS.Properties<string | number> {
      /**
       * enable to add properties to this interface.
       */
    }


  

    interface ComponentAttributes {
      /**
       * Assigns a ref to an element.
       * */
      ref?: any;
    }


    export interface IntrinsicElements {
      div: HEA.HTMLElementAttributes;
      p: HEA.HTMLElementAttributes;
      span: HEA.HTMLElementAttributes;
      input: HEA.InputElementAttributes;
      label: HEA.LabelElementAttributes;
      button: HEA.ButtonElementAttributes;
      a: HEA.AnchorElementAttributes;
      table: HEA.HTMLElementAttributes;
      tr: HEA.HTMLElementAttributes;
      td: HEA.HTMLElementAttributes;
      th: HEA.HTMLElementAttributes;
      tbody: HEA.HTMLElementAttributes;
      thead: HEA.HTMLElementAttributes;
      tfoot: HEA.HTMLElementAttributes;
      ul: HEA.HTMLElementAttributes;
      li: HEA.HTMLElementAttributes;
      ol: HEA.LiElementAttributes;
      h1: HEA.HTMLElementAttributes;
      h2: HEA.HTMLElementAttributes;
      h3: HEA.HTMLElementAttributes;
      h4: HEA.HTMLElementAttributes;
      h5: HEA.HTMLElementAttributes;
      h6: HEA.HTMLElementAttributes;
      header: HEA.HTMLElementAttributes;
      footer: HEA.HTMLElementAttributes;
      nav: HEA.HTMLElementAttributes;
      main: HEA.HTMLElementAttributes;
      aside: HEA.HTMLElementAttributes;
      section: HEA.HTMLElementAttributes;
      article: HEA.HTMLElementAttributes;
      form: HEA.FormElementAttributes;
      select: HEA.SelectElementAttributes;
      option: HEA.OptionElementAttributes;
      textarea: HEA.TextareaElementAttributes;
      video: HEA.VideoElementAttributes;
      audio: HEA.HTMLElementAttributes;
      source: HEA.SourceElementAttributes;
      track: HEA.HTMLElementAttributes;
      canvas: HEA.CanvasElementAttributes;
      embed: HEA.HTMLElementAttributes;
      iframe: HEA.IframeElementAttributes;
      object: HEA.HTMLElementAttributes;
      param: HEA.HTMLElementAttributes;
      picture: HEA.HTMLElementAttributes;
      svg: HEA.HTMLElementAttributes;
      math: HEA.HTMLElementAttributes;
      del: HEA.HTMLElementAttributes;
      img: HEA.ImgElementAttributes;
      ins: HEA.HTMLElementAttributes;
      caption: HEA.HTMLElementAttributes;
      col: HEA.HTMLElementAttributes;
      colgroup: HEA.HTMLElementAttributes;
      fieldset: HEA.FieldsetElementAttributes;
      legend: HEA.HTMLElementAttributes;
      datalist: HEA.HTMLElementAttributes;
      optgroup: HEA.HTMLElementAttributes;
      keygen: HEA.HTMLElementAttributes;
      output: HEA.HTMLElementAttributes;
      progress: HEA.ProgressElementAttributes;
      meter: HEA.HTMLElementAttributes;
      details: HEA.HTMLElementAttributes;
      summary: HEA.HTMLElementAttributes;
      menuitem: HEA.HTMLElementAttributes;
      menu: HEA.HTMLElementAttributes;
      dialog: HEA.DialogElementAttributes;
      slot: HEA.HTMLElementAttributes;
      template: HEA.TemplateElementAttributes;
      // [elemName: string]: any;
    }

    export type Element
      = IntrinsicElements
      | VirtualElement
      | VirtualElementChild
      | string
      | number
      | boolean
      | null
      | undefined
      | (() => (Element | Element[]));

  }
}
export { };