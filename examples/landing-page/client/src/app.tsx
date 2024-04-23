

import { SSR, createRef, createSignal } from "sig";
import { Store } from "sig/store";

const fromState = new Store({
    name: '',
    email: '',
    message: '',
    color: ''
});

export function setName(name: string) {
    fromState.setState(state => ({ ...state, name }));
}

export function setEmail(email: string) {
    fromState.setState(state => ({ ...state, email }));
}

export function setMessage(message: string) {
    fromState.setState(state => ({ ...state, message }));
}

export function App() {
    const color$ = fromState.select(state => state.color);
    const [query$] = createSignal<Record<string, string>>({ color: undefined });
    query$.link(color$, (color) => ({ color }));
    return (
        <SSR fetch={ { url: '/layout', config: {}, query: query$ } }fallback={<p>Loading</p>}>
            <Form />
        </SSR>
    );
}

function Form() {
    const name$ = fromState.select(state => state.name);
    const email$ = fromState.select(state => state.email);
    const message$ = fromState.select(state => state.message);
    const formRef = createRef<HTMLFormElement>();
    const submit = () => {
        fromState.setState(state => ({ ...state, color: 'red'}));
        if(formRef.current?.checkValidity() === false) {
            alert('From is invalid');
            return;
        };
        alert(
            `Name: ${name$()}\nEmail: ${email$()}\nMessage: ${message$()}`
        );
    }
    return (
        <div className="flex flex-col w-3/4 px-40 py-16">
        <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
        <form ref={formRef} className="mt-8 space-y-6">
            <div>
                <label for="name" className="sr-only">Name</label>
                <input 
                    onInput={(e) => setName(e.target.value)}
                    value={name$ as unknown as string}
                    id="name" 
                    name="name" 
                    type="text" 
                    required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Name" />
            </div>
            <div>
                <label for="email" className="sr-only">Email</label>
                <input 
                    onInput={(e) => setEmail(e.target.value)}
                    value={email$ as unknown as string}
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email" />
            </div>
            <div>
                <label for="message" className="sr-only">Message</label>
                <textarea 
                    onInput={(e) => setMessage(e.target.value)}
                    value={message$ as unknown as string}
                    id="message"
                    name="message"
                    required 
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Message"></textarea>
            </div>
            <div className="w-1/3 mx-auto">
                <button 
                    type="submit" 
                    onClick={submit}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Submit
                </button>
            </div>
        </form>
    </div>
    )
}
