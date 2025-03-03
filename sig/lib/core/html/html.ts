import { KeyBuilder } from "@/common/key-builder/key-builder";
import { ElementKeySymbol } from "@/symbols";
import logger from "@/common/logger/logger";

export const DOM = {

    removeElementsBetween(start: Node, end: Node) {
        let current = start.nextSibling;
        while (current && current !== end) {
            const next = current.nextSibling;
            current.remove();
            current = next;
        }
    },


    getChildNodes(dom: HTMLElement): ChildNode[] {
        return Array.from(dom.childNodes);
    },

    createElement(tagName: string, key: KeyBuilder, options?: ElementCreationOptions): HTMLElement {
        const element = document.createElement(tagName, options);
        element[ElementKeySymbol] = key.toString();
        return element;
    },

    createComment(comment: string): Comment {
        return document.createComment(comment);
    },

    appendChild(parent: HTMLElement, child?: Node | Node[]): void {
        try {
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
        } catch (error) {
            console.error(error);
        }
    },

    insertBefore(referenceNode: ChildNode, newNode: (ChildNode | ChildNode[])) {
        if (Array.isArray(newNode)) {
            referenceNode.before(...newNode);
        }
        else {
            referenceNode.before(newNode);
        }
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