import { createRoot, createElement } from '../../lib/core';
import { App } from './app';

createRoot(document.getElementById('root'))
    .render(
        createElement(App)
    );