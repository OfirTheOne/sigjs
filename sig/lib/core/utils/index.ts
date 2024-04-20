import { VirtualElement } from "@/types";

export function isNodeHTMLElement(node: Node): node is HTMLElement {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

export function isNodeText(node: Node): node is Text {
  return node && node.nodeType === Node.TEXT_NODE;
}


export function isVirtualElement(value: unknown): value is VirtualElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}