import { createRoot, element } from '@/core';
import { App } from './app';

createRoot(document.getElementById('root'))
    .render(element(App));