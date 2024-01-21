import { VirtualElement } from "./types";
import { render } from "./render";

function createRoot(domElement?: HTMLElement): { render: (element: VirtualElement) => void } {
    return {
        render(element: VirtualElement) {
            if (!domElement) {
                throw new Error('No root element provided');
            }
            render(element, domElement);
        }
    };
}

export { createRoot };