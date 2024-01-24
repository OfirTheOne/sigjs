import { createRoot, createElement } from '@/core';
import { App } from './app';

createRoot(document.getElementById('root'))
    .render(
        createElement(App)
    );