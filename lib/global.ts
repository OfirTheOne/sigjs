
const SigSymbol = Symbol('[SIG]');

type SigGlobal = Readonly<{
    signals: Record<string, unknown>;
    roots: Record<string, unknown>;
}>

function getGlobal(): SigGlobal {
    if(!window[SigSymbol]) {
        addGlobal();
    }
    return  window[SigSymbol];
}

function createSig(): SigGlobal {
    return Object.freeze({
        signals: {},
        roots: {},
    });
}

function addGlobal() {
    if(typeof window == 'undefined') {
        return;
    }
    if(!window[SigSymbol]) {
        window[SigSymbol] = createSig();
    }
}

export type { SigGlobal };
export {
    getGlobal,
    addGlobal
};
