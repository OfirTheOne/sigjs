import { createRoot } from 'sig/core';
import { App } from './app';

createRoot(document.getElementById('root'), {
    ssr: {
        baseUrl: 'http://localhost:3030'
    }
})
    .render(<App />);