import type * as CSS from 'csstype';
import type { VirtualElement } from "@sig/types";

declare global {

  // export namespace Sig {
  //   export type ClassList = Array<Trackable<unknown> | string | string[] | Record<string, boolean | Trackable<unknown>>>;

  // }
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
      [elemName: string]: any;
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