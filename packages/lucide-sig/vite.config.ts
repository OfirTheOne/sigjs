import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import pkg from './package.json';
import fs from 'fs';
import { icons } from 'lucide'; // Get available icons

function generateIconsPlugin() {
  return {
    name: 'vite-plugin-generate-icons',
    buildStart() {
      const outDir = path.resolve('lib/generated-icons'); // Where to generate files

      // Ensure the directory exists
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const exportsConfig = {};
      // Generate a wrapper file for each icon
      Object.keys(icons).forEach((iconName) => {
        const filePath = path.join(outDir, `${iconName}.ts`);
        const content = `
import { ${iconName} as Lucide${iconName}, createElement } from 'lucide';
import { adaptSvgToVirtualElement } from '../index';

export default function ${iconName}(props: Record<string, unknown> = {}) {
  const svg = createElement(Lucide${iconName})
  const { size, ...rest } = props;
  if (size) {
      svg.style.width = size + "px";
      svg.style.height = size + "px";
  }
  return adaptSvgToVirtualElement(svg, rest);
}`;

        fs.writeFileSync(filePath, content, 'utf-8');
        exportsConfig[`./${iconName}`] = `./dist/generated-icons/${iconName}.js`;
      });


      console.log(`Generated ${Object.keys(icons).length} wrapped icons.`);
    }
  };
}


export default defineConfig({
  root: '.' ,
  build: {
    sourcemap: true,
    lib: {
      entry: {}, // No need to specify entries manually
      formats: ['es'],
      fileName: (format) => `[name].${format}.js`,
      name: pkg.name,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'lib'),
    }
  },
  css: { modules: { localsConvention: 'camelCase' } },
  plugins: [
    generateIconsPlugin(),
    dts({
      outDir: 'dist',
      copyDtsFiles: true,
    })
  ],
});