
import { ComponentFunction, For, SSR, Signal } from 'sig';
import { Store } from 'sig/store';
import Facebook from './../assets/icons/facebook_icon.svg';
import TwitterIcon from './../assets/icons/twitter_icon.svg';
import YoutubeIcon from './../assets/icons/youtube_icon.svg';
import ShoppingBag from './../assets/icons/shopping-bag.svg';
import { createRouter, getParams, getRouter } from 'sig/router';

const store = new Store({
    recipes: [
        {
            title: 'Recipe 1',
            id: '1',
            image: 'https://via.placeholder.com/180x220',
            description: 'Description 1'
        },
        {
            title: 'Recipe 2',
            id: '2',
            image: 'https://via.placeholder.com/180x220',
            description: 'Description 2'
        },
        {
            title: 'Recipe 3',
            id: '3',
            image: 'https://via.placeholder.com/180x220',
            description: 'Description 3'
        },
        {
            title: 'Recipe 4',
            id: '4',
            image: 'https://via.placeholder.com/180x220',
            description: 'Description 4'
        },
        {
            title: 'Recipe 5',
            id: '5',
            image: 'https://via.placeholder.com/180x220',
            description: 'Description 5'
        },
        {
            title: 'Recipe 6',
            id: '6',
            image: 'https://via.placeholder.com/180x220',
            description: 'Description 6'
        },
    ]
});

interface Recipe {
    id: string, 
    title: string,
    image: string,
    description: string,
}

export function App() {
    const recipes$ = store.select(state => state.recipes);
    return createRouter({
        routes: [
            { path: '/', component: () => <RecipesGrid recipes$={recipes$} /> },
            { path: '/about', component: () => <div>About</div> },
            { path: '/contact', component: () => <div>Contact</div> },
            { path: '/recipes', component: () => <RecipesGrid recipes$={recipes$} /> },
            { path: '/recipes/:id', component: () => <RecipePage /> },
            { path: '/videos', component: () => <div>Videos</div> },
            { path: '/cookbook', component: () => <div>Cookbook</div> },
            { path: '/press', component: () => <div>Press</div> },
        ],
        layout: Layout
    });
}


const Layout = ((_props, children) => {
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
            <div className='flex justify-center text-4xl text-center w-1/5'>Title</div>
            <div className='flex justify-around w-1/4'>
                <div onClick={() => push('/cookbook')} className='flex'>Cookbook</div>
                <div onClick={() => push('/press')} className='flex'>Press</div>
                <div onClick={() => push('/contact')} className='flex'>Contact</div>
            </div>
    </nav>);
}

function RecipesGrid({recipes$}: { recipes$: Signal<Recipe[]>}) {
    return (
        <For 
            as = 'div'
            asProps={{ className: 'flex flex-wrap justify-around gap-4' }}
            list={recipes$} 
            factory={(recipe) => <RecipeCard  {...recipe} />}
        />
    );
}

function RecipeCard(props: Recipe) {
    const { push } = getRouter();

    return (<div 
        className='flex flex-col' 
        onClick={() => push(`/recipes/${props.id}`)}>
        <img src={props.image} alt={props.title} />
        <h3>{props.title}</h3>
        <p>{props.description}</p>
    </div>);
}


function RecipePage() {
    const params = getParams();
    const recipeId = params.id;
    const recipe$ = store.select(state => state.recipes.find(recipe => recipe.id === recipeId));
    if(recipe$.value === undefined) {
        return <p>Recipe not found</p>
    }
    return <SSR fetch={`/recipes/${recipeId}`} fallback={<p>Loading</p>} />

}