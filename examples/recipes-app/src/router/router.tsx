

import { createRouter, ShouldEnterCallback } from 'sig/router';
import { RecipePage } from '../components/pages/recipe.page';
import { RecipesPage } from '../components/pages/recipes.page';
import { Layout } from '../components/layout/layout';
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
    return true;
    return fetch('http://localhost:3030/validate', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(res => {
        if (res && res.valid) {
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
            router.push('/');
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
            { path: '/', shouldEnter: authGuardAsync, component: () => <RecipesPage /> },
            { path: '/login', shouldEnter: loginRedirect, component: () => <LoginPage /> },
            { path: '/about', component: () => <div>About</div> },
            { path: '/contact', component: () => <div>Contact</div> },
            { path: '/recipes', shouldEnter: authGuardAsync,  component: () => <RecipesPage /> },
            { path: '/recipes/:id', shouldEnter: authGuardAsync, component: () => <RecipePage /> },
            { path: '/videos', shouldEnter: authGuardAsync, component: () => <div>Videos</div> },
            { path: '/cookbook', shouldEnter: authGuardAsync, component: () => <div>Cookbook</div> },
            { path: '/press', component: () => <div>Press</div> },
        ],
        layout: Layout
    });
}