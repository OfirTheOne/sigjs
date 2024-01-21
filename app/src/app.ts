import './app.scss';
import { createRoot, createElement } from '../../lib/index';
import { createSignal } from '../../lib/index';


export const [count, setCount] = createSignal(0);


// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
    createElement('div', { className: 'container' },
        createElement('h1', { className: 'title' }, 'Hello World'),
        createElement('p', { className: 'text' }, 
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
            'Nullam auctor, nisl eget ultricies aliquam, ' + 
            'nunc sapien aliquet urna, sed aliquam nisl nunc sed nisl.'
        ),
        createElement('p', {}, `Count: `,count), // Display the current count
        createElement('button', { onClick: () => setCount(count.value + 1) }, 'Increment count'), // Button to increment the count
        createElement('a', { className: 'link', href: 'https://google.com' }, 'Google'),
    )
);