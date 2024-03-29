import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
    resolve: {
        alias: {
            '@sig': path.resolve(__dirname, '../../dist'),
        }
    },
    css: { modules: { localsConvention: 'camelCase' } },
    esbuild: {
        jsxFactory: 'createElement',
        jsxFragment: 'createFragment',
        jsxInject: `import { createFragment, createElement } from '@sig/jsx';`,
    },
    optimizeDeps: {
        disabled: true,
        // include: [path.resolve(__dirname, '../sig/dist/sig.js'),],
    },
});