
import { RenderedRootSymbol, SigSymbol } from '@/symbols';
import type { RootElementWithMetadata } from '../dom-render/create-root';
import { SigGlobal } from './global.types';



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


export {
    getGlobal,
    getRenderedRoot,
    setRenderedRoot,
    addRoot
};
