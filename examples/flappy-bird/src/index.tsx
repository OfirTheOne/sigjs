import { createRoot } from '@sigjs/sig/core';
import { App } from './app';

createRoot(document.getElementById('root'))
    .render(<App />);