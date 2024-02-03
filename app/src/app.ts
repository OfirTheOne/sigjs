import './app.scss';
import { element } from '@/core/index';
import { createSignal } from '@/core/signal/signal';
import { Await, For, If } from '@/core/control-flow';
import { createRef } from '@/core/create-ref';
import { createRouter, getRouter } from '@/router/router';
import { a, button, div, h1, input, label, p } from '@/convenient/element';


export function App() {
    const menuButton = createRef<HTMLInputElement>();
    return div({ className: 'container', },
        input({ type: 'checkbox', hidden: true, id: "menu-button" }),
        label(
            { for: "menu-button", className: 'toggle-menu', ref: menuButton },
            'Toggle Menu'
        ),
        div({ className: 'menu' },
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
    const { push } = getRouter();
    return div({ className: 'container' },
        h1({ className: 'title' }, 'Hello World'),
        button({ onClick: () => push('/about') }, 'Click'),
        p({ className: 'text' },
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
            'Nullam auctor, nisl eget ultricies aliquam, ' +
            'nunc sapien aliquet urna, sed aliquam nisl nunc sed nisl.'
        ),
        a({ className: 'link', href: 'https://google.com' }, 'Google'),
        Await(AsyncUser, { fallback: p({}, 'Loading...') }),
        element(Counter, { title: 'Counter 1' }),
        element(Counter, { title: 'Counter 2' }),
    );
}

function Counter({ title }: { title: string }) {
    const [count, setCount] = createSignal(0);
    const [className,] = createSignal('even');
    const [list,] = createSignal<number[]>([]);
    className.link(count, (countValue) => countValue % 2 ? 'odd' : 'even');
    list.link(count, (countValue) => {
        const list = [];
        for (let i = 0; i < countValue; i++) {
            list.push(i);
        }
        return list;
    });
    return (
        div({},
            p({}, `${title}: `, count, ' is ', className),
            button({ onClick: () => setCount(count.value + 1) }, 'Increment count'),
            div({},
                If({
                    condition: count,
                    then: p({}, 'Count is not zero')
                }),
                For({
                    list,
                    factory: (item) => p({}, item)
                }),
            )
        )
    );
}

async function AsyncUser() {
    await delay(5000);
    return div({},
        p({}, 'User name: ', 'John Doe'),
    );
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function Page01() {
    const [searchInput, setSearchInput] = createSignal('');
    const [users,] = createSignal(['John', 'Jane', 'Doe']);
    const [filteredUsers,] = createSignal<string[]>(users());
    const menuButton = createRef<HTMLInputElement>();
    const { push } = getRouter();
    filteredUsers.link(searchInput, (searchInputValue) => {
        return users().filter(user => user.includes(searchInputValue));
    });

    return div({ className: 'container', },
        input({ type: 'checkbox', hidden: true, id: "menu-button" }),
        button({ onClick: () => push('/about') }, 'Click'),
        label(
            { for: "menu-button", className: 'toggle-menu', ref: menuButton },
            'Toggle Menu'
        ),
        div({ className: 'menu' },
            'Menu content...'
        ),

        div({ className: 'input-container' },
            label({}, 'Search'),
            input({
                type: 'text',
                value: searchInput(),
                onInput: (event: Event) => setSearchInput((event.target as HTMLInputElement).value)
            }),
        ),
        For({
            list: filteredUsers,
            factory: (user) => p({}, user),
            index: (user, i) => `${user}-${i}`
        }),
    );
}



