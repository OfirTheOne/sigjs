import { createRoot } from '@sigjs/sig/core';
import { Pacman } from './app';

createRoot(document.getElementById('root'))
    .render(<Pacman />);