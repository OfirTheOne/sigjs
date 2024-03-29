import { createRoot, element } from '@sig/core';
import { App } from './app';

createRoot(document.getElementById('root'))
    .render(element(App));