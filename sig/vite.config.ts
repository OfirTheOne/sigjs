import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
  root: '.' ,
  build: {
    sourcemap: true,
    lib: {
      entry: {
        main: './lib/index.ts',
        core: './lib/core/index.ts',
        store: './lib/store/index.ts',
        jsx: './lib/jsx/index.ts',
        router: './lib/router/index.ts',
        convenient: './lib/convenient/index.ts'
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName: string) => {
        return `${
          entryName === 'main' ? 
            '' : `${entryName}/` 
          }index.${format === 'es' ? 'js' : 'umd.cjs'}`;
      },
      name: pkg.name,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'lib'),
    }
  },
  css: { modules: { localsConvention: 'camelCase' } },
  plugins: [dts()],
});