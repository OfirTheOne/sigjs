import { VirtualElement } from "../../types";
import { setRenderedRoot, getGlobal, addRoot  } from "../global";
import { render } from "./render";

interface RootElement {
    render: (element: VirtualElement) => void;
    domElement?: HTMLElement;
}

interface RootElementWithMetadata extends RootElement {
    id: string;
}

function createRoot(domElement?: HTMLElement | null): RootElement {
    if(!domElement) {
        throw new Error('No root element found');
    }
    const rootId = `[[r-${Object.keys(getGlobal().roots).length}]]`;
    const root: RootElementWithMetadata = {
        id: rootId,
        domElement,
        render(element: VirtualElement) {
            if (!domElement) {
                throw new Error('No root element provided');
            }
            setRenderedRoot(root.id);
            render(element, domElement);
        }
    };
    addRoot(root);
    return root;
}

export type { RootElement, RootElementWithMetadata };
export { createRoot };