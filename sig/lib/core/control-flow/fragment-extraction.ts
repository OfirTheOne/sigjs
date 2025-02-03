export function fragmentExtraction(
    renderedElement: (HTMLElement | Text) | (HTMLElement | Text)[],
    container: HTMLElement,
) {
    if(renderedElement === container) {
        return Array.from(renderedElement.children) as (HTMLElement | Text)[];
    }
    return renderedElement;
}
