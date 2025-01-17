import { createRouter } from '@sigjs/sig/router';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';

export function Router() {
    return createRouter({
        routes: [
            {
                path: '/',
                component: Layout,
                children: [
                    { index: true, component: HomePage }
                ]
            }
        ]
    });
}