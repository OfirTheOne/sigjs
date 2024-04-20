
const SigSymbol = Symbol('[SIG]');
const RenderedRootSymbol = Symbol('[RR]');
import type { RootElementWithMetadata } from './dom-render/create-root';

type SigGlobal = Readonly<{
    signals: Record<string, unknown>;
    roots: Record<string, RootElementWithMetadata>;
    [RenderedRootSymbol]: {
        rootId?: string;
    }
}>;

function getRenderedRoot() {
    const rootId = getGlobal()[RenderedRootSymbol].rootId;
    if(!rootId) {
        throw new Error('Out of a root context');
    }
    return getGlobal().roots?.[rootId];
}

function setRenderedRoot(rootId: string) {
    if(getGlobal().roots?.[rootId]) {
        return getGlobal()[RenderedRootSymbol].rootId = rootId;
    } 
}

function addRoot(root: RootElementWithMetadata) {
    getGlobal().roots[root.id] = root;
}

function createSig(): SigGlobal {
    return Object.freeze({
        signals: {},
        roots: {},
        [RenderedRootSymbol]: {}
    });
}

function getGlobal(): SigGlobal {
    if(!window[SigSymbol]) {
        addGlobal();
    }
    return  window[SigSymbol];
}

function addGlobal() {
    if(typeof window == 'undefined') {
        return;
    }
    if(!window[SigSymbol]) {
        window[SigSymbol] = createSig();
    }
}
addGlobal();


export type { SigGlobal };
export {
    getGlobal,
    getRenderedRoot,
    setRenderedRoot,
    addRoot
};
