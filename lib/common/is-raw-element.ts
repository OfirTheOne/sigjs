
function isHTMLElement(value: any): value is HTMLElement {
  return value instanceof HTMLElement;
}

function isSVGElement(value: any): value is SVGElement {
  return value instanceof SVGElement;
}

function isRawElement(value: any): value is Element {
  return isHTMLElement(value) || isSVGElement(value);
}

export { isRawElement, isHTMLElement, isSVGElement };