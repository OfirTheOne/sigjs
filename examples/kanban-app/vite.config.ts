
import { defineConfig } from 'vite';
import sigjsPlugin from '@sigjs/vite-plugin/dist/index';


export default defineConfig({
  plugins: [sigjsPlugin()],
});