import './app.scss';
import { element } from '@/core/index';
import { createSignal } from '@/core/signal/signal';
import { Await, For, If } from '@/core/control-flow';

export function App2() {
    return element('div', { className: 'container' },
        element('h1', { className: 'title' }, 'Hello World'),
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

export function App() {
    const [searchInput, setSearchInput] = createSignal('');
    const [users,] = createSignal(['John', 'Jane', 'Doe']);
    const [filteredUsers,] = createSignal<string[]>(users());

    filteredUsers.link(searchInput, (searchInputValue) => {
        return users().filter(user => user.includes(searchInputValue));
    });

    return element('div', { className: 'container', },
        element('input', { type: 'checkbox', hidden: true, id: "menu-button" }),
        element('label', { for: "menu-button", className: 'toggle-menu' }, 'Toggle Menu'),
        element('div', { className: 'menu' },
            'Menu content...'
        ),

        element('input', { 
            type: 'text', 
            value: searchInput(), 
            onInput: (event: Event) => setSearchInput((event.target as HTMLInputElement).value) 
        }),
        For({ 
            list: filteredUsers, 
            factory: (user) => element('p', {}, user), 
            index: (user, i) => `${user}-${i}`
        }),
    );
}


`
<div>
    <p> {#sid:10002} </p>
</div>
`
