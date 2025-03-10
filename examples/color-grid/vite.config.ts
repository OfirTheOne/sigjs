
import { defineConfig, Plugin } from 'vite';
import sigjsPlugin from '@sigjs/vite-plugin/dist/index';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [sigjsPlugin(), tailwindcss()],
});