import { createRouter, Navigate } from '@sigjs/sig/router';
import { Layout } from './components/Layout';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { AboutPage } from './pages/AboutPage';

export function Router() {
    return createRouter({
        routes: [
            {
                path: '/',
                component: Layout,
                children: [
                    { index: true, component: () => <Navigate to="/playground" /> },
                    { path: '/playground', component: PlaygroundPage },
                    { path: '/about', component: AboutPage }
                ]
            }
        ]
    });
}