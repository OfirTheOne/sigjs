

import { createRouter, ShouldEnterCallback } from 'sig/router';
import { RecipePage } from '../components/pages/recipe.page';
import { RecipesPage } from '../components/pages/recipes.page';
import { AppLayout } from '../components/layout/layout';
import { LoginPage } from '../components/pages/login.page';


const authGuardAsync: ShouldEnterCallback = async () => {
    const token = localStorage.getItem('token');
    // return true;
    const res = await fetch('http://localhost:3030/validate', {
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    const parsedRes = await res.json();
    if (parsedRes && parsedRes.valid) {
        return true;
    } else {
        localStorage.removeItem('token');
        console.log('You are not logged in');
        alert('You are not logged in');
        return { path: '/login' };
    }
}

const loginRedirect: ShouldEnterCallback = () => {
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
            return { path: '/app' };
        } else {
            localStorage.removeItem('token');
            console.log('You are not logged in');
            alert('You are not logged in');
            return true;
        }
    });
}

export function AppRouter() {
    return createRouter({
        useViewTransition: true,
        routes: [
            {
                path: '/',
                component: () => <AppLayout />,
                children: [
                    { 
                        path: 'login', 
                        shouldEnter: loginRedirect, 
                        component: () => <LoginPage />,
                        memo: false
                    },
                    { 
                        path: 'app', 
                        shouldEnter: authGuardAsync, 
                        component: () => <router-outlet></router-outlet>, 
                        children: [
                            { path: 'about', component: () => <div>About</div> },
                            { path: 'contact', component: () => <div>Contact</div> },
                            { path: 'recipes', memo: false, shouldEnter: authGuardAsync, component: () => <RecipesPage /> },
                            { path: 'recipes/:id', memo: false, shouldEnter: authGuardAsync, component: () => <RecipePage /> },
                            { path: 'videos', component: () => <div>Videos</div> },
                            { path: 'cookbook', component: () => <div>Cookbook</div> },
                            { path: 'press', component: () => <div>Press</div> },
                        ]
                    },
                ]
            }
        ],
    });
}