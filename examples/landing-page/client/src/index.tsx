import { createRoot } from 'sig/core';
import { App } from './app';

createRoot(document.getElementById('root'), {
    ssr: {
        baseUrl: 'http://localhost:3000'
    }
})
    .render(<App />);