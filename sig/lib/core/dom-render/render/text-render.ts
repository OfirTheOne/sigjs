export function textRender(
    text: string,
): HTMLElement | Text {
    return document.createTextNode(text);
}
