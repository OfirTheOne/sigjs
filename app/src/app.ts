import './app.scss';
import { element } from '@/core/index';
import { createSignal } from '@/core/signal/signal';
import { Await, For, If } from '@/core/control-flow';
import { createRef } from '@/core/create-ref';
import { createRouter, getRouter } from '@/router/router';


export function App() {

    const menuButton = createRef<HTMLInputElement>();
    return element('div', { className: 'container', },
        element('input', { type: 'checkbox', hidden: true, id: "menu-button" }),
        element(
            'label', 
            { for: "menu-button", className: 'toggle-menu', ref: menuButton }, 
            'Toggle Menu'
        ),
        element('div', { className: 'menu' },
            'Menu content...'
        ),
        createRouter({
            routes: [
                {
                    path: '/',
                    component: Page02,
                },
                {
                    path: '/about',
                    component: () => {
                        return element('div', {}, 'about page') 
                    }
                }
            ],
    
        })
    );
}

export function Page02() {
    const {push} = getRouter();
    return element('div', { className: 'container' },
        element('h1', { className: 'title' }, 'Hello World'),
        element('button', { onClick: () => push('/about') }, 'Click'),

        element('p', { className: 'text' }, 
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
            'Nullam auctor, nisl eget ultricies aliquam, ' + 
            'nunc sapien aliquet urna, sed aliquam nisl nunc sed nisl.'
        ),
        element('a', { className: 'link', href: 'https://google.com' }, 'Google'),
        Await(AsyncUser, { fallback: element('p', {}, 'Loading...') }),
        element(Counter, { title: 'Counter 1'}),
        element(Counter, { title: 'Counter 2'}),
    );
}

function Counter({ title } : { title: string }) {
    const [count, setCount] = createSignal(0);
    const [className, ] = createSignal('even');
    const [list, ] = createSignal<number[]>([]);
    className.link(count, (countValue) => countValue % 2 ? 'odd' : 'even');
    list.link(count, (countValue) => {
        const list = [];
        for(let i = 0; i < countValue; i++) {
            list.push(i);
        }
        return list;
    });
    return (
        element('div', {},
            element('p', {}, `${title}: `,count, ' is ', className),
            element('button', { onClick: () => setCount(count.value + 1) }, 'Increment count'),
            element('div', {},
                If({ 
                    condition: count, 
                    then: element('p', {}, 'Count is not zero') 
                }),
                For({ 
                    list, 
                    factory: (item) => element('p', {}, item) 
                }),
            )
        )
    );
}

async function AsyncUser() {
    await delay(5000);
    return element('div', {},
        element('p', {}, 'User name: ', 'John Doe'),
    );
} 

function delay (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function Page01() {
    const [searchInput, setSearchInput] = createSignal('');
    const [users,] = createSignal(['John', 'Jane', 'Doe']);
    const [filteredUsers,] = createSignal<string[]>(users());
    const menuButton = createRef<HTMLInputElement>();
    const {push} = getRouter();
    filteredUsers.link(searchInput, (searchInputValue) => {
        return users().filter(user => user.includes(searchInputValue));
    });

    return element('div', { className: 'container', },
        element('input', { type: 'checkbox', hidden: true, id: "menu-button" }),
        element('button', { onClick: () => push('/about') }, 'Click'),
        element(
            'label', 
            { for: "menu-button", className: 'toggle-menu', ref: menuButton }, 
            'Toggle Menu'
        ),
        element('div', { className: 'menu' },
            'Menu content...'
        ),

        element('div', { className: 'input-container' },
            element('label', {}, 'Search'),
            element('input', { 
                type: 'text', 
                value: searchInput(), 
                onInput: (event: Event) => setSearchInput((event.target as HTMLInputElement).value) 
            }),
        ),
        For({ 
            list: filteredUsers, 
            factory: (user) => element('p', {}, user), 
            index: (user, i) => `${user}-${i}`
        }),
    );
}
