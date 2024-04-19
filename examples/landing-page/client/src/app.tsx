

import { Await, createRef } from "sig";
import { Store } from "sig/store";

const fromState = new Store({
    name: '',
    email: '',
    message: '',
});

customElements.define('outlet', class extends HTMLElement { });

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
    const name$ = fromState.select(state => state.name);
    const email$ = fromState.select(state => state.email);
    const message$ = fromState.select(state => state.message);
    const formRef = createRef<HTMLFormElement>();
    const submit = () => {
        if(formRef.current?.checkValidity() === false) {
            alert('From is invalid');
            return;
        };
        alert(
            `Name: ${name$()}\nEmail: ${email$()}\nMessage: ${message$()}`
        );
    }

    return (
        <div className=" flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-shrink-0">
                            <img className="h-8 w-8" src="logo.svg" alt="Logo" />
                        </div>
                        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                            <a href="#feature" className="mr-5 hover:text-gray-900">Feature</a>
                            <a href="#pricing" className="mr-5 hover:text-gray-900">Pricing</a>
                            <a href="#contact" className="mr-5 hover:text-gray-900">Contact</a>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex flex-1 flex-row">
                <div className="w-3/5 flex flex-col">
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
                </div>
                <div className="w-2/5 flex flex-col flex-1">
                    <div className="flex flex-col items-center justify-center flex-1">
                        <div className="flex flex-row h-1/2 gap-4 py-6">
                            <div className="flex justify-start items-end flex-col gap-4">
                                <div className="flex flex-row gap-2">
                                    <div className="h-2 w-2 bg-slate-400/20 -mt-16"></div>
                                    <div className="h-6 w-6 bg-blue-400/20 -mt-14"></div>
                                    <div className="h-12 w-12 bg-blue-600/20 -mt-8"></div>
                                    <div className="h-24 w-24 items-end bg-indigo-400/20"></div>

                                </div>
                                <div className="h-32 w-32 bg-purple-400/20"></div>
                            </div>
                            <div className="flex justify-end flex-end flex-col gap-4">
                                <div className="h-24 w-24 bg-teal-400/20"></div>
                                <div className="h-36 w-36 bg-orange-400/20"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <Await component={Posts} fallback={<p>Loading posts</p>} />
            </main>
        </div>  
    );
}


async function Posts() {
    await delay(5000);
    const response = await fetch('http://localhost:3000/posts');
    const posts = await response.text();
    return <div ref={(dom: HTMLDivElement) => { dom.innerHTML = posts; }}></div>;
}





function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Suppose you have an HTML string
let htmlString = '<div class="post"><h2 class="title">Title</h2><p class="content"><outlet /></p></div>';

// Create a new DOM element
let template = document.createElement('template');
template.innerHTML = htmlString;

// Access the elements
let postElement = template.content.querySelector('.post');
let titleElement = template.content.querySelector('.title');
let contentElement = template.content.querySelector('.content');
let outletElement = template.content.querySelector('outlet');

// Manipulate the elements
titleElement.textContent = 'New Title';
contentElement.textContent = 'New Content';

// Create a new element to replace the outlet element
let newElement = document.createElement('span');
newElement.textContent = 'New Element';

// Replace the outlet element with the new element
outletElement.replaceWith(newElement);

// Now you can append the post element to the DOM
document.body.appendChild(postElement);