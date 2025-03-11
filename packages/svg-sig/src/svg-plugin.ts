
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

export function svgSig(): Plugin {
    return {
      name: 'svg-sig-plugin',
      transform(_code: string, id: string) {
        if (id.endsWith('.svg')) {
          const svgContent = fs.readFileSync(id, 'utf-8');
          const escapedSvgContent = JSON.stringify(svgContent);
          return {
            code: `
  import { createRawElement } from "@sigjs/sig";

  function createSvgElement(svgContent) {
      const div = document.createElement("div");
      div.innerHTML = svgContent.trim();
      for (let i = 0; i < div.childNodes.length; i++) {
          const child = div.childNodes[i];
          if (child.nodeName.toLowerCase() === "svg") {
              return child;
          }
      }
      throw new Error("No SVG element found in the provided content");
  }

  function cloneSvgElement(svg) {
    return svg.cloneNode(true);
  }

  function adaptSvgToVirtualElement(svg, props = {}) {
    return createRawElement(
      svg,
      props
    )
  }

  let svgElement = null;

  export function SvgComponent(props = {}) {
    svgElement = svgElement || createSvgElement(${escapedSvgContent});
    const svg = cloneSvgElement(svgElement);
    return adaptSvgToVirtualElement(svg, props);
  }`,
  map: null // Provide source map if available

          };
        } else if(id.endsWith('.svg?raw')) {
          const svgContent = fs.readFileSync(id.replace('?raw', ''), 'utf-8');
          return `
  export default JSON.stringify(${svgContent});`;
        }
      },
      resolveId(source: string) {
        if (source.endsWith('.svg')) {
          return path.resolve(process.cwd(), source);
        } else if (source.endsWith('.svg?raw')) {
          return path.resolve(process.cwd(), source.replace('?raw', ''));
        }
      },
      load(id: string) {
        if (id.endsWith('.svg')) {
          return fs.readFileSync(id, 'utf-8');
        } else if (id.endsWith('.svg?raw')) {
          return fs.readFileSync(id.replace('?raw', ''), 'utf-8');
        }
      },
    };
  }