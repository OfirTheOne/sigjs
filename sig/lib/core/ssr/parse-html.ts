import { isNodeElement, isNodeText } from "../utils";

export function parseHtml(html: string): Element | Text {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const processedDom = dom.body.firstChild;
    if(!processedDom) {
        throw new Error('Invalid SSR HTML');
    }
    if(isNodeElement(processedDom) || isNodeText(processedDom)){
        return processedDom;
    }
    throw new Error('Processed SSR HTML is not a valid node');
}
