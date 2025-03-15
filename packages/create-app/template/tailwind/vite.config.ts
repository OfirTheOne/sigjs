
import { defineConfig } from 'vite';
import sigjsPlugin from '@sigjs/vite-plugin';
import svgSig from '@sigjs/svg-sig';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [sigjsPlugin(), svgSig(), tailwindcss()],
});