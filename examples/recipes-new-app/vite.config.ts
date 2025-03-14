
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
        jsxInject: `import { createFragment, createElement } from '@sigjs/sig/jsx'`,
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
          export default function(props = {}) {
            const className = props.className || '';
            const div = document.createElement('div');
            div.innerHTML = ${escapedSvgContent}.trim();
            const svg = div.firstChild;
            const splittedClassName = className
              .split(' ')
              .map((c) => c.trim())
              .filter(Boolean);
            if (splittedClassName.length) {
              svg.classList.add(splittedClassName);
            }
            return svg;
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