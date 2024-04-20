function createFragment(_emptyTag: null, ...children: unknown[]) { return children.filter(Boolean).flat(Infinity); }


export { createFragment };