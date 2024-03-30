import { VirtualElement } from "@/types";



export function isVirtualElement(value: unknown): value is VirtualElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}