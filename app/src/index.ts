import { createRoot, createElement } from '../../lib';
import { App } from './app';

createRoot(document.getElementById('root'))
    .render(
        createElement(App)
    );