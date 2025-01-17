import { Plugin } from 'vite';
import path from 'path';
import { svgPlugin } from './svg-plugin';

export default function sigjsPlugin(): Plugin {
  return {
    name: 'vite-plugin-sigjs',
    config() {
      return {
        plugins: [svgPlugin()],
        publicDir: path.resolve(__dirname, './assets'),
        css: { modules: { localsConvention: 'camelCase' } },
        esbuild: {
          jsxFactory: 'createElement',
          jsxFragment: 'createFragment',
          jsxInject: `import { createFragment, createElement } from 'sig/jsx'`,
        },
        optimizeDeps: {
          disabled: true,
        },
      };
    },
  };
}

