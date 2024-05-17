
import { ComponentFunction, For, SSR, Signal, createRef, createSignal } from 'sig';
import { combineLatest } from 'sig/core';
import { getParams, getRouter } from 'sig/router';
import { store } from '../store';
import { Recipe } from '../types';

import Facebook from './../../assets/icons/facebook_icon.svg';
import TwitterIcon from './../../assets/icons/twitter_icon.svg';
import YoutubeIcon from './../../assets/icons/youtube_icon.svg';
import ShoppingBag from './../../assets/icons/shopping-bag.svg';

export const Layout = ((_props, children) => {
    return (<div>
        <NavBar />
        <SecondaryNavBar />
        { children }
    </div>)
}) as ComponentFunction;

function NavBar() {
    return (<nav className='flex flex-row items-center h-14 bg-yellow-200/30 px-8'>
        <p className='flex flex-1'>Search</p>
        <ul className='flex flex-row justify-end gap-6 items-center'>
            <li className='flex h-6 w-6'>{ ShoppingBag() }</li>
            <li className='flex h-6 w-6'>{ Facebook() }</li>
            <li className='flex h-6 w-6'>{ TwitterIcon() }</li>
            <li className='flex h-6 w-6'>{ YoutubeIcon() }</li>
        </ul>
    </nav>);
}

function SecondaryNavBar() {
    const { push } = getRouter();
    return (<nav className='flex flex-row justify-around items-center bg-yellow-100/10 h-20 px-14'>
        <div className='flex justify-around w-1/4'>
            <div onClick={() => push('/about')} className='flex'>About</div>
            <div onClick={() => push('/recipes')} className='flex'>Recipes</div>
            <div onClick={() => push('/videos')} className='flex'>Videos</div>
        </div>
        <div className='flex justify-center text-4xl text-center w-1/5'>Recipes App</div>
        <div className='flex justify-around w-1/4'>
            <div onClick={() => push('/cookbook')} className='flex'>Cookbook</div>
            <div onClick={() => push('/press')} className='flex'>Press</div>
            <div onClick={() => push('/contact')} className='flex'>Contact</div>
        </div>
    </nav>);
}

export function RecipesPage() {
    const storeRecipes$ = store.select(state => state.recipes);
    const [filter$, ] = createSignal('');
    const filteredRecipes$ = combineLatest([storeRecipes$, filter$])
        .derive(([recipes, filter]) => recipes
            .filter(recipe => !filter ? true : recipe.title.toLowerCase()
                .includes(filter.toLowerCase())));
    return (
        <div className="flex flex-col gap-4 px-20">
            <FilterSection filter$={filter$} />
            <RecipesGrid recipes$={filteredRecipes$} />
        </div>
    );

}

function FilterSection({ filter$ }: { filter$: Signal<string> }) {
    return (
        <div className="flex flex-col justify-center w-1/3 gap-2 m-auto">
            <h3 className="text-xl font-semibold">Filter</h3>
            <input
                type="text"
                className="border border-l-blue-200 rounded-md"
                placeholder="Search"
                onInput={(e: Event) => filter$.setValue((e.target as HTMLInputElement).value)}
            />
        </div>
    );
}

export function RecipesGrid({ recipes$ }: { recipes$: Signal<Recipe[]> }) {
    return (
        <For 
            as = 'div'
            asProps={{ className: 'flex flex-wrap justify-around gap-4' }}
            list={recipes$} 
            index={(recipe) => recipe.id}
            factory={(recipe) => <RecipeCard {...recipe} />}
        />
    );
}

function RecipeCard(props: Recipe) {
    return (<a 
        router-link={true}
        className='flex flex-col uppercase' 
        href={`/recipes/${props.id}`}
    >
        <img src={props.image} alt={props.title} className={'w-60 h-80'} />
        <h3>{props.title}</h3>
    </a>);
}

export function RecipePage() {
    const [renderOnCommentSubmit$] = createSignal<unknown>(0);
    const params = getParams();
    const recipeId = params.id;
    return (
        <SSR 
            fetch={`/recipes/${recipeId}`} 
            fallback={<p>Loading</p>} 
            rerun={renderOnCommentSubmit$} > 
            <SubmitCommentSection  
                name = 'submit-comment'
                onSubmit$={renderOnCommentSubmit$}
                recipeId={recipeId} />
        </SSR>
    );
}

function SubmitCommentSection({
    onSubmit$,
    recipeId
} : { 
    name: string
    onSubmit$: Signal<unknown>,
    recipeId: string 
}) {
    const commentInputRef = createRef<HTMLInputElement>();
    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const comment = commentInputRef.current?.value;
        fetch(`http://localhost:3030/recipes/${recipeId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ author: 'Joni', comment }),
            headers: { 'Content-Type': 'application/json' }
        }).then(() => onSubmit$.emit(void 0));
    }

    return (<div className='flex flex-col w-1/2 gap-2'>
        <h3 className='text-xl font-semibold'>Submit a comment</h3>
        <textarea 
            ref={commentInputRef}
            className='flex-1 min-h-16 border border-l-blue-200 rounded-md' 
            name='comment' 
            placeholder='Add a comment' 
        />
        <button 
            preventDefault
            className='bg-blue-500 text-white w-20 rounded' 
            onClick={handleSubmit}>Submit</button>
    </div>);
}