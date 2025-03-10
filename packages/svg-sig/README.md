# Sig.JS Vite Plugin

This is a Vite plugin for Sig.js application.

## Installation

To install the plugin, run:

```bash
npm install @sigjs/vite-plugin
```

## Usage

Add the plugin to your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import sigjsPlugin from '@sigjs/vite-plugin';

export default defineConfig({
    plugins: [sigjsPlugin()],
});
```

## Configuration

You can configure the plugin by passing options:

```javascript
sigjsPlugin({
    publicDir: path.resolve(__dirname, './public-dir'),
});
```

## License

This project is licensed under the MIT License.