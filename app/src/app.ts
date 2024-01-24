import './app.scss';
import { createRoot, createElement } from '@/index';
import { createSignal } from '@/signal';
import { Await, For, If } from '@/control-flow';

createRoot(document.getElementById('root')).render(
    createElement('div', { className: 'container' },
        createElement('h1', { className: 'title' }, 'Hello World'),
        createElement('p', { className: 'text' }, 
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
            'Nullam auctor, nisl eget ultricies aliquam, ' + 
            'nunc sapien aliquet urna, sed aliquam nisl nunc sed nisl.'
        ),
        createElement('a', { className: 'link', href: 'https://google.com' }, 'Google'),
        Await(AsyncUser, { fallback: createElement('p', {}, 'Loading...') }),
        createElement(Counter, { title: 'Counter 1'}),
        createElement(Counter, { title: 'Counter 2'}),
    )
);

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
        createElement('div', {},
            createElement('p', {}, `${title}: `,count, ' is ', className),
            createElement('button', { onClick: () => setCount(count.value + 1) }, 'Increment count'),
            createElement('div', {},
                If({ 
                    condition: count, 
                    then: createElement('p', {}, 'Count is not zero') 
                }),
                For({ 
                    list, 
                    factory: (item) => createElement('p', {}, item) 
                }),
            )
        )
    );
}

async function AsyncUser() {
    await delay(5000);
    return createElement('div', {},
        createElement('p', {}, 'User name: ', 'John Doe'),
    );
} 

function delay (ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

