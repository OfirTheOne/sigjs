import './app.scss';
// import { element } from '@sig/convenient/element';
import { VirtualElement, createSignal } from 'sig';
import { Await, For, If, createRef } from 'sig/core';
import { createRouter, getRouter } from 'sig/router';
import { a, button, div, h1, p } from 'sig/convenient';


export function App(): VirtualElement {
    const menuButton = createRef<HTMLInputElement>();
    return div({ className: 'container', },
        <>
            <input type='checkbox' hidden id="menu-button" />
            <label
                for={"menu-button"}
                className={'toggle-menu'}
                ref={menuButton}
            >
                Toggle Menu
            </label>
            <div  className='menu'>
                Menu content...
            </div>
        </>,
        createRouter({
            routes: [
                {
                    path: '/',
                    component: Page02,
                },
                {
                    path: '/about',
                    component: () => {
                        return <div>
                            about page
                        </div>;
                    }
                }
            ],

        })
    );
}

export function Page02(): JSX.Element {
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
        <Await component={AsyncUser} fallback={<p>Loading...</p>} />,
        // element(Counter, { title: 'Counter 2' }),
        <Counter title='Counter 1' />
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
        <div>
            <p>{title}: {count}, is {className}</p>
            <button
                onClick={() => setCount(count.value + 1)}>
                Increment count
            </button>
            <div>
                <If
                    condition={count}
                    then={<p>Count is not zero</p>}
                />
                <For
                    list={list}
                    factory={(item) => <p>{item}</p>}
                />
            </div>
        </div>
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

    return <div  className='container'> 
        <input  type='checkbox' hidden id="menu-button" />

        <button  onClick={() => push('/about')}>Click</button>
        <label for="menu-button" className='toggle-menu' ref={menuButton}>Toggle Menu</label>
        <div className='menu'>Menu content...</div>
        <div className='input-container'>
            <label>Search</label>
            <input 
                type='text' 
                value={searchInput()} 
                onInput={(event: Event) => setSearchInput((event.target as HTMLInputElement).value)} 
            />
        </div>
        <For
            list={filteredUsers}
            factory={(user) => <p>{user}</p> }
            index={(user, i) => `${user}-${i}`}
        />
    </div>;
}



