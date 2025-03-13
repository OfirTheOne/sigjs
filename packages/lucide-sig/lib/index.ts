import { createRawElement } from "@sigjs/sig";

export const adaptSvgToVirtualElement = (svg: SVGElement, props: Record<string, unknown> = {}) => {
    return createRawElement(
        svg as unknown as HTMLElement,
        props
    )
}