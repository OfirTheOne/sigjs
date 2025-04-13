import { createSignal } from '@sigjs/sig';
import { Case, Default, For, If, Switch, createRef, Await } from '@sigjs/sig';
import { createRouter, getRouter } from '@sigjs/sig/router';
import { store, increment } from './store'
import { SvgComponent } from './assets/HomerSimpson.svg';
import AArrowDown from "@sigjs/lucide-sig/AArrowDown";

const LazyAsyncUser = () => import('./AsyncUser');

const myElem = document.createElement('p');
myElem.innerHTML='Hello World';

function AppLayout(_props, children) {
    const menuButton = createRef<HTMLInputElement>();
    return <div className='container'>
        <input type='checkbox' hidden id="menu-button" />
        <label
            for={"menu-button"}
            className={'toggle-menu'}
            ref={menuButton}
        >
            Toggle Menu
        </label>
        <div className='menu'>
            Menu content...
        </div>
        { children }
    </div>
} 

export function App() {
    return <AppLayout>
        {createRouter({
            routes: [
                {
                    path: '/',
                    component: Page02,
                },
                {
                    path: '/about',
                    component: function About() {
                        return <div>
                            about page
                        </div>;
                    }
                }
            ],

        })}
    </AppLayout>
}

export function Page02(): JSX.Element {
    const { push } = getRouter();

    const [toggleSignal$, setToggleSignal] = createSignal(false);

    setTimeout(() => {
        setToggleSignal(true);
    }, 5 * 1000);

    return <div className='container'>
        { myElem }
        <h1 className='title'>Hello World</h1>
        <button onClick={() => push('/about')}>Click</button>
        <p className='text'>
            {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
            'Nullam auctor, nisl eget ultricies aliquam, ' +
            'nunc sapien aliquet urna, sed aliquam nisl nunc sed nisl.'}
        </p>
        <a className='link' href='https://google.com'>
            Google
        </a>
        <If
            condition={toggleSignal$}
            then={
            <Await component={LazyAsyncUser} fallback={<p>Loading...</p>} />
        }
        />
        <Counter title='Counter 1' />
        <AArrowDown />
        <Switch condition={store.select((state) => state.count)}>
            <Case value={(value) => value%3 === 0}>
                <p>Count is divisible by 3</p>
            </Case>
            <Case value={(value) => value%2 === 0}>
                <p>Count is even</p>
            </Case>
            <Default>
                <p>Count is odd and not divisible by 3</p>
            </Default>
        </Switch>
        <SvgComponent />
    </div>;
}

function Counter({ title }: { title: string }) {
    const count = store.select((state) => state.count)
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
                onClick={() => increment()}>
                Increment count
            </button>

            
            <div>
                <If
                    condition={count}
                    then={<p>Count is not zero</p>}
                />
                <For
                    list={list}
                    factory={({item}) => <p>{item}</p>}
                    index={(item, i) => `${item}-${i}`}
                />
            </div>
        </div>
    );
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

    return <div className='container'>
        <input type='checkbox' hidden id="menu-button" />
        <button onClick={() => push('/about')}>Click</button>
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
            factory={({item: user}) => <p>{user}</p>}
            index={(user, i) => `${user}-${i}`}
        />
    </div>;
}




