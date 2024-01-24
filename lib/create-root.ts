import { VirtualElement } from "./types";
import { render } from "./render";
import { getGlobal } from "./global";

interface RootElement {
    render: (element: VirtualElement) => void;
    domElement?: HTMLElement;
}

interface RootElementWithMetadata extends RootElement {
    id: string;
}


function createRoot(domElement?: HTMLElement | null): RootElement {
    const root: RootElementWithMetadata = {
        id: `[[r-${getGlobal().roots.length}]]`,
        domElement,
        render(element: VirtualElement) {
            if (!domElement) {
                throw new Error('No root element provided');
            }
            render(element, domElement);
        }
    };
    return root;
}

export type { RootElement, RootElementWithMetadata };
export { createRoot };