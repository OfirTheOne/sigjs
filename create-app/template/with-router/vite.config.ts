
import { defineConfig } from 'vite';
import sigjsPlugin from '@sigjs/vite-plugin';


export default defineConfig({
    plugins: [sigjsPlugin()],
});