import './app.scss';
import { createRoot, createElement } from '../../lib/index';
import { createSignal } from '../../lib/index';
import { For, If } from '@/control-flow';



createRoot(document.getElementById('root')).render(
    createElement('div', { className: 'container' },
        createElement('h1', { className: 'title' }, 'Hello World'),
        createElement('p', { className: 'text' }, 
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
            'Nullam auctor, nisl eget ultricies aliquam, ' + 
            'nunc sapien aliquet urna, sed aliquam nisl nunc sed nisl.'
        ),
        createElement('a', { className: 'link', href: 'https://google.com' }, 'Google'),
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
            createElement('p', {}, `${title}: `,count, ' is ', className), // Display the current count
            createElement('button', { onClick: () => setCount(count.value + 1) }, 'Increment count'), // Button to increment the count
            createElement('div', {},
                If({ condition: count, then: createElement('p', {}, 'Count is not zero') }),
                For({ list, factory: (item) => createElement('p', {}, item) }),
            )
        )
    );
}