import { KeyBuilder } from "@/common/key-builder/key-builder";
import { ElementKeySymbol } from "@/symbols";


export const DOM = {
    createElement(tagName: string, key: KeyBuilder,options?: ElementCreationOptions): HTMLElement {
        const element = document.createElement(tagName, options);
        element[ElementKeySymbol] = key.toString();
        return element;
    }
}