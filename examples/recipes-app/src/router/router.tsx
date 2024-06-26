

import { createRouter } from 'sig/router';
import { RecipePage } from '../components/pages/recipe.page';
import { RecipesPage } from '../components/pages/recipes.page';
import { Layout } from '../components/layout/layout';

export function AppRouter() {
    return createRouter({
        routes: [
            { path: '/', component: () => <RecipesPage /> },
            { path: '/about', component: () => <div>About</div> },
            { path: '/contact', component: () => <div>Contact</div> },
            { path: '/recipes', component: () => <RecipesPage /> },
            { path: '/recipes/:id', component: () => <RecipePage /> },
            { path: '/videos', component: () => <div>Videos</div> },
            { path: '/cookbook', component: () => <div>Cookbook</div> },
            { path: '/press', component: () => <div>Press</div> },
        ],
        layout: Layout
    });
}