import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
  root: '.' ,
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: pkg.name,
      fileName: "index",
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