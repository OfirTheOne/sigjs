
import { defineConfig, Plugin } from 'vite';
import sigjsPlugin from '@sigjs/vite-plugin';
import svgSig from '@sigjs/svg-sig';


export default defineConfig({
  plugins: [sigjsPlugin() as Plugin, svgSig() as Plugin],
});