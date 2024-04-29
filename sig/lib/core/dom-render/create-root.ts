import { setRenderedRoot, getGlobal, addRoot } from "../global";
import { render } from "./render";
import { type VirtualElement } from "../../types";
import { type RootSSRMetadata } from "../ssr/ssr.types";
import { observeRoot } from "../global/global-hook-executioner";


interface CreateRootOptions {
    ssr?: RootSSRMetadata;
}

interface RootElement {
    render: (element: VirtualElement) => void;
    domElement?: HTMLElement;
}

interface RootElementWithMetadata extends RootElement {
    id: string;
    ssr?: RootSSRMetadata
}

function createRoot(domElement?: HTMLElement | null, options?: CreateRootOptions): RootElement {
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
        },
        ssr: options?.ssr
    };
    addRoot(root);
    observeRoot(domElement);
    return root;
}

export type { RootElement, RootElementWithMetadata, CreateRootOptions };
export { createRoot };