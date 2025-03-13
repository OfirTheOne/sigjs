import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { icons } from 'lucide';
import pkg from './package.json';

function createIconComponentContent(iconName: string) {
  return `
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
}

function generateIconsPlugin() {
  return {
    name: 'vite-plugin-generate-icons',
    buildStart() {
      const outDir = path.resolve('lib/generated-icons'); // Where to generate files
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
      const exportsConfig: Record<string, Record<string, string>> = {};
      // Generate a wrapper file for each icon
      Object.keys(icons).forEach((iconName) => {
        const filePath = path.join(outDir, `${iconName}.ts`);
        const content = createIconComponentContent(iconName);

        fs.writeFileSync(filePath, content, 'utf-8');
        exportsConfig[`./${iconName}`] = {
          "import": `./dist/${iconName}.mjs`,
          "require": `./dist/${iconName}.mjs`,
          "types": `./dist/generated-icons/${iconName}.d.ts`
        };
      });
      pkg['exports'] = exportsConfig as any;
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf-8');


      console.log(`Generated ${Object.keys(icons).length} wrapped icons.`);
    }
  };
}

export default defineConfig({
  root: '.',
  build: {
    sourcemap: true,
    lib: {
      entry: {}, // No need to specify entries manually
      formats: ['es'],
    },
    rollupOptions: {
      input: (() => {
        const dir = path.join('./lib', 'generated-icons');
        const absInputDir = path.resolve(dir);
        if (!fs.existsSync(absInputDir)) {
          console.warn(`Directory ${absInputDir} does not exist.`);
          return {};
        }
        const files = fs.readdirSync(absInputDir)
          .filter(file => file.endsWith('.ts'))
          .reduce((entries, file) => {
            const name = path.basename(file, '.ts');
            entries[name] = `./${path.join(dir, file)}`;
            return entries;
          }, {} as Record<string, string>);

        return files;
      })(),
    }
  },
  plugins: [
    generateIconsPlugin(),
    dts({
      outDir: 'dist',
      copyDtsFiles: true,
    })
  ],
});