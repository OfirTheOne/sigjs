import { KeyBuilder } from "@/common/key-builder/key-builder";
import { ElementKeySymbol } from "@/symbols";


export const DOM = {
    createElement(tagName: string, key: KeyBuilder,options?: ElementCreationOptions): HTMLElement {
        const element = document.createElement(tagName, options);
        element[ElementKeySymbol] = key.toString();
        return element;
    },

    createComment(comment: string): Comment {
        return document.createComment(comment);
    },

    appendChild(parent: HTMLElement, child: Node | Node[]): void {
        if(!Array.isArray(child)) {
            if (child.parentElement !== parent) {
                parent.appendChild(child);
            }
        } else { 
            parent.append(...child);
            // child.forEach((c) => {
            //     if (c.parentElement !== parent) {
            //     }
            // });
        }
    },

    addComment(node: Node, comment: string) {
        const commentNode = DOM.createComment(comment);
        node.appendChild(commentNode);
    }
}