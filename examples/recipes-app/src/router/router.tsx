

import { createRouter, ShouldEnterCallback } from 'sig/router';
import { RecipePage } from '../components/pages/recipe.page';
import { RecipesPage } from '../components/pages/recipes.page';
import { AppLayout } from '../components/layout/layout';
import { LoginPage } from '../components/pages/login.page';

const authGuard: ShouldEnterCallback = (path, params, state, router) => {
    const token = localStorage.getItem('token');
    if (!token) {
        setTimeout(() => router.push('/login'), 0);
        return false;
    }
    return true;
}


const authGuardAsync: ShouldEnterCallback = (path, params, state, router) => {
    const token = localStorage.getItem('token');
    // return true;
    return fetch('http://localhost:3030/validate', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(res => {
        if (res && res.valid) {
            return true;
        } else {
            localStorage.removeItem('token');
            console.log('You are not logged in');
            alert('You are not logged in');
            setTimeout(() => router.push('/login'), 0);
            return false;
        }
    });
}


const loginRedirect: ShouldEnterCallback = (path, params, state, router) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return true;
    }
    return fetch('http://localhost:3030/validate', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(res => {
        if (res && res.valid) {
            setTimeout(() => router.push('/'), 0);
            // router.push('/');
            return false;
        } else {
            localStorage.removeItem('token');
            console.log('You are not logged in');
            alert('You are not logged in');
            return false;
        }
    });
}



export function AppRouter() {
    return createRouter({
        routes: [
            {
                path: '/',
                component: () => <AppLayout />,
                children: [
                    { 
                        path: 'login', 
                        shouldEnter: loginRedirect, 
                        component: () => <LoginPage /> 
                    },
                    { 
                        path: 'app', 
                        shouldEnter: authGuardAsync, 
                        component: () => <RecipesPage />, 
                        children: [
                            { path: 'about', component: () => <div>About</div> },
                            { path: 'contact', component: () => <div>Contact</div> },
                            { 
                                path: 'recipes', 
                                shouldEnter: authGuardAsync,  
                                component: () => <RecipesPage />,
                                // children: [
                                // ]
                            },
                            { path: 'recipes/:id', shouldEnter: authGuardAsync, component: () => <RecipePage /> },
                            { path: 'videos', component: () => <div>Videos</div> },
                            { path: 'cookbook', component: () => <div>Cookbook</div> },
                            { path: 'press', component: () => <div>Press</div> },
                        ]
                    },
                ]
            }
        ],
        // layout: Layout
    });
}