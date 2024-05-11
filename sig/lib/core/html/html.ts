import { KeyBuilder } from "@/common/key-builder/key-builder";
import { ElementKeySymbol } from "@/symbols";


export const DOM = {
    createElement(tagName: string, key: KeyBuilder,options?: ElementCreationOptions): HTMLElement {
        const element = document.createElement(tagName, options);
        element[ElementKeySymbol] = key.toString();
        return element;
    },

    appendChild(parent: HTMLElement, child: Node | Node[]): void {
        if(!Array.isArray(child)) {
            if (child.parentElement !== parent) {
                parent.appendChild(child);
            }
        } else { 
            child.forEach((c) => {
                if (c.parentElement !== parent) {
                    parent.appendChild(c);
                }
            });
        }
    }
}