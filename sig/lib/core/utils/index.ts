import { VirtualElement } from "@/types";

export function isNodeElement(node: unknown): node is Element {
  return !!node && (node as Node)?.nodeType === Node.ELEMENT_NODE;
}

export function isNodeText(node: unknown): node is Text {
  return !!node && (node as Node)?.nodeType === Node.TEXT_NODE;
}

export function isHTMLElement(value: any): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function isSVGElement(value: any): value is SVGElement {
  return value instanceof SVGElement;
}

export function isRawElement(value: any): value is Element | Text {
  return isNodeElement(value) || isSVGElement(value) || isNodeText(value);
}


export function isVirtualElement(value: unknown): value is VirtualElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}