import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import pkg from './package.json';

// Use an environment variable to switch between configurations
const isLibBuild = process.env.BUILD_TARGET === 'lib';

export default defineConfig({
  root: isLibBuild ? '.' : './app',
  build: {
    sourcemap: true,
    lib: isLibBuild ? {
      entry: path.resolve(__dirname, "lib/index.ts"),
      name: pkg.name,
      fileName: "index",
    } : undefined,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'lib'),
    }
  },
  css: { modules: { localsConvention: 'camelCase' } },
  plugins: [dts()],
});