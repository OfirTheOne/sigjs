
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';


export default defineConfig({
    // resolve: {
    //     alias: {
    //         '@sig': path.resolve(__dirname, '../../sig/dist'),
    //     }
    // },
    plugins: [svgPlugin()],
    publicDir: path.resolve(__dirname, './assets'),
    css: { modules: { localsConvention: 'camelCase' } },
    esbuild: {
        jsxFactory: 'createElement',
        jsxFragment: 'createFragment',
        jsxInject: `import { createFragment, createElement } from 'sig/jsx'`,
    },
    optimizeDeps: {
        disabled: true,
        // include: [path.resolve(__dirname, '../sig/dist/sig.js'),],
    },
});

function svgPlugin() {
  return {
    name: 'svg-plugin',
    transform(code, id) {
      if (id.endsWith('.svg')) {
        const svgContent = fs.readFileSync(id, 'utf-8');
        const escapedSvgContent = JSON.stringify(svgContent);
        return `
          export default function() {
            const div = document.createElement('div');
            div.innerHTML = ${escapedSvgContent}.trim();
            return div.firstChild;
          }
        `;
      }
    },
    resolveId(source) {
      if (source.endsWith('.svg')) {
        return path.resolve(process.cwd(), source);
      }
    },
    load(id) {
      if (id.endsWith('.svg')) {
        return fs.readFileSync(id, 'utf-8');
      }
    },
  };
}