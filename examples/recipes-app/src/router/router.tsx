

import { createRouter } from 'sig/router';
import { Layout, RecipePage, RecipesGrid } from '../components';
// import { store } from '../store';

export function AppRouter() {
    return createRouter({
        routes: [
            { path: '/', component: () => <RecipesGrid /> },
            { path: '/about', component: () => <div>About</div> },
            { path: '/contact', component: () => <div>Contact</div> },
            { path: '/recipes', component: () => <RecipesGrid /> },
            { 
                path: '/recipes/:id', 
                // shouldEnter: recipePageGuard , 
                component: () => <RecipePage /> 
            },
            { path: '/videos', component: () => <div>Videos</div> },
            { path: '/cookbook', component: () => <div>Cookbook</div> },
            { path: '/press', component: () => <div>Press</div> },
        ],
        layout: Layout
    });
}