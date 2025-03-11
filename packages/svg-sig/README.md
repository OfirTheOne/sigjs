# SVG Vite Plugin for Sig.JS

Vite plugin to transform SVGs into sIG.js components.

## Installation

To install the plugin, run:

```bash
# npm
npm install --save-dev @sigjs/svg-sig

# yarn
yarn add -D @sigjs/svg-sig

# pnpm
pnpm add -D @sigjs/svg-sig

```

## Usage

Add the plugin to your `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import svgSig from '@sigjs/vite-plugin';

export default defineConfig({
    // ...
    plugins: [
        // ...
        svgSig(),
    ],
});
```

Add the following to your `src/vite-env.d.ts` for better type interface:

```typescript
/// <reference types="@sigjs/svg-sig/client" />
```


Now you can import SVG files as Sig.JS components:

```javascript
import { SvgComponent } from './path/to/file.svg';

const App = () => {
    return (
        <SvgComponent />
    );
};
```

## License

MIT 