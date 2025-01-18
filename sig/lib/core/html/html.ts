import { KeyBuilder } from "@/common/key-builder/key-builder";
import { ElementKeySymbol } from "@/symbols";
import logger from "@/common/logger/logger";

export const DOM = {
    createElement(tagName: string, key: KeyBuilder, options?: ElementCreationOptions): HTMLElement {
        const element = document.createElement(tagName, options);
        element[ElementKeySymbol] = key.toString();
        return element;
    },

    createComment(comment: string): Comment {
        return document.createComment(comment);
    },

    appendChild(parent: HTMLElement, child?: Node | Node[]): void {
        if(child === null || child === undefined) {
            return;
        }
        if (parent === null || parent === undefined) {
            logger.error('Parent is null or undefined');
            return;
        }
        if (parent === child) {
            logger.error('Parent is the same as child');
            return;
        }
        if (parent instanceof Text) {
            logger.error('Parent is a text node');
            return;
        }
        try {
            if (!Array.isArray(child)) {
                if (child.parentElement !== parent) {
                    parent.appendChild(child);
                }
            } else {
                parent.append(...child);
            }
        } catch (error) {
            logger.log(error);

        }
    },

    addComment(node: Node, comment: string) {
        const commentNode = DOM.createComment(comment);
        node.appendChild(commentNode);
    },

    classListRemove(dom: HTMLElement, value: string | string[]) {
        let values: string[] = typeof value === 'string' ? 
            value.trim().split(/\s+/) : value;
        values = values
            .map(v => v.trim())            
            .filter(v => v.length > 0);
        if (values.length === 0) {
            return;
        }
        dom.classList.remove(...values);
    },

    classListAdd(dom: HTMLElement, value: string | string[]) {
        let values: string[] = typeof value === 'string' ? 
            value.trim().split(/\s+/) : value;  
        values = values
            .map(v => v.trim())
            .filter(v => v.length > 0);
        if (values.length === 0) {
            return;
        }
        dom.classList.add(...values);
    },

    removeAllChildren(dom: HTMLElement) {
        while (dom.lastChild) {
            dom.lastChild.remove();
        }
    }
}