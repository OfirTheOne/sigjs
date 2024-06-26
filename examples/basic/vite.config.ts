import { defineConfig } from 'vite';
export default defineConfig({
    css: { modules: { localsConvention: 'camelCase' } },
    esbuild: {
        jsxFactory: 'createElement',
        jsxFragment: 'createFragment',
        jsxInject: `import { createFragment, createElement } from 'sig/jsx'`,
    },
    optimizeDeps: {
        disabled: true,
    },
});