import { setRenderedRoot, getGlobal, addRoot } from "../global";
import { render } from "./render";
import { adaptVirtualElementChild } from "./create-element/adapt-virtual-element-child";
import { observeRoot } from "../global/global-hook-executioner";
import type { Renderable } from "../../types";
import type { RootSSRMetadata } from "../ssr/ssr.types";


interface CreateRootOptions {
    ssr?: RootSSRMetadata;
}

interface RootElement {
    render: (element: Renderable) => void;
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
    observeRoot(domElement);
    const rootId = `[[r-${Object.keys(getGlobal().roots).length}]]`;
    const root: RootElementWithMetadata = {
        id: rootId,
        domElement,
        render(element: Renderable) {
            if (!domElement) {
                throw new Error('No root element provided');
            }
            setRenderedRoot(root.id);
            render(adaptVirtualElementChild(element), domElement);
        },
        ssr: options?.ssr
    };
    addRoot(root);
    return root;
}

export type { RootElement, RootElementWithMetadata, CreateRootOptions };
export { createRoot };