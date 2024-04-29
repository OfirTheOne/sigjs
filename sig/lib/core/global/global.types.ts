
import { RenderedRootSymbol } from '@/symbols';
import type { RootElementWithMetadata } from '../dom-render/create-root';

export type SigGlobal = Readonly<{
    signals: Record<string, unknown>;
    roots: Record<string, RootElementWithMetadata>;
    [RenderedRootSymbol]: {
        rootId?: string;
    }
}>;