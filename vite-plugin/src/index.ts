import { fileURLToPath } from 'url'
import { Plugin } from 'vite';
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export interface SigjsAppConfig {
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug';
  memoize?: boolean;
}

export interface SigjsPluginOptions { 
  publicDir?: string; 
  appConfig?: SigjsAppConfig;
}

export default function sigjsPlugin(options?: SigjsPluginOptions): Plugin {

  const publicDir = options?.publicDir || path.resolve(__dirname, './assets');
  return {
    name: 'vite-plugin-sigjs',
    config() {  
      return {
        envPrefix: 'SIGJS',
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
        define: {
          'globalThis.env.SIGJS_APP_CONFIG': JSON.stringify(options?.appConfig || {}),
        },
      };
    },
  };
}
