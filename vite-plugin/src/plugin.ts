import { Plugin } from 'vite';
import path from 'path';
import { svgPlugin } from './svg-plugin';

export interface SigjsPluginOptions { 
  publicDir?: string; 
}

export default function sigjsPlugin(options?: SigjsPluginOptions): Plugin {

  const publicDir = options?.publicDir || path.resolve(__dirname, './assets');
  return {
    name: 'vite-plugin-sigjs',
    config() {  
      return {
        plugins: [svgPlugin()],
        publicDir,
        css: { modules: { localsConvention: 'camelCase' } },
        esbuild: {
          jsxFactory: 'createElement',
          jsxFragment: 'createFragment',
          jsxInject: `import { createFragment, createElement } from '@sigjs/sig/jsx'`,
        },
        optimizeDeps: {
          disabled: true,
        },
      };
    },
  };
}
