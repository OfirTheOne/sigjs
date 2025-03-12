import { createElement } from "lucide";
import type * as lucide from "lucide";
import { ComponentFunction, createRawElement } from "@sigjs/sig";

type IconKeys<T> = {
    [K in keyof T]: T[K] extends lucide.IconNode ? K : never;
  }[keyof T];
  
type LucideIconsKeys = keyof  Pick<typeof lucide, IconKeys<typeof lucide>>;
  
export const adaptSvgToVirtualElement = (svg: SVGElement, props: Record<string, unknown> = {}) => {
    return createRawElement(
        svg as unknown as HTMLElement,
        props
    )
}

// const componentFactory = (iconNode: lucide.IconNode) => {
//     return function Icon(props: Record<string, unknown> = {}) {
//         const svg = createElement(iconNode as lucide.IconNode)
//         const { size, ...rest } = props;
//         if (size) {
//             svg.style.width = `${size}px`;
//             svg.style.height = `${size}px`;
//         }
//         return adaptSvgToVirtualElement(svg, rest);
//     }
// }
  

// function createIcon(iconText: string , iconNode: lucide.IconNode) {

// }

// export function createIcons<K extends LucideIconsKeys>(icons: Record<K, lucide.IconNode>): Record<K, ComponentFunction> {
//     return Object.entries(icons).reduce((acc, [key, iconNode]) => {
//             acc[key] = componentFactory(iconNode as lucide.IconNode);
//             return acc;
//         }, 
//         {} as Record<LucideIconsKeys, ComponentFunction>
//     );
// }