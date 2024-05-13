

import { createRouter } from 'sig/router';
import { Layout, RecipePage, RecipesGrid } from '../components';
// import { store } from '../store';

export const createAppRouter = () => createRouter({
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

// function recipePageGuard(params: Record<string, string>) {
//     const isRecipeExists =  store.getState().recipes.find(recipe => recipe.id === params.id);
//     if(isRecipeExists) return true;
//     fetch('http://localhost:3030/recipes')
//         .then(res => res.json())
//         .then(recipes => {
//         store.setState((state) =>({ ...state, recipes }));
//     });
//     return true;
// }