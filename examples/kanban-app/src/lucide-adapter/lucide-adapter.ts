import { createElement, type IconNode } from "lucide";

export function lucideSigjs(icon: IconNode) {
  function IconComponent(props: { className?: string; size?: number } = {}) {
    const iconElement = createElement(icon);
    const className = props.className || "";

    const splittedClassName = className
      .split(" ")
      .map((c) => c.trim())
      .filter(Boolean);
    if (splittedClassName.length) {
      iconElement.classList.add(...splittedClassName);
    }

    if (props.size) {
      iconElement.style.width = `${props.size}px`;
      iconElement.style.height = `${props.size}px`;
    }

    return iconElement;
  }
  return IconComponent;
}
