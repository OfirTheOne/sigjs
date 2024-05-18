
import { For, Signal, createSignal } from 'sig';
import { combineLatest } from 'sig/core';
import { store } from '../../store';
import { Recipe } from '../../types';

export function RecipesPage() {
    const storeRecipes$ = store.select(state => state.recipes);
    const [search$,] = createSignal('');
    const [filter$,] = createSignal({
        mostPopular: false,
        newest: false
    });
    const filteredRecipes$ = combineLatest([storeRecipes$, search$, filter$])
        .derive(([recipes, search, filter]) => {
            const filteredRecipes = recipes
                .filter(recipe => !search ? true : recipe.title.toLowerCase()
                    .includes(search.toLowerCase()));
            if (filter.mostPopular) {
                return filteredRecipes.sort((a, b) => b.popularity - a.popularity);
            } else if (filter.newest) {
                return filteredRecipes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            }
            return filteredRecipes;
        });

    return (<div className="flex flex-col gap-4 px-20">
        <FilterSection search$={search$} filter$={filter$} />
        <RecipesGrid recipes$={filteredRecipes$} />
    </div>);

}

function FilterSection({ search$, filter$ }: {
    search$: Signal<string>,
    filter$: Signal<{ mostPopular: boolean, newest: boolean }>
}) {
    return (
        <div className='m-auto flex flex-row gap-4'>
            <div className='w-60 flex flex-col gap-4'>
                <div className="flex flex-col justify-center ">
                    <h3 className="text-lg font-semibold">Search</h3>
                    <input
                        type="text"
                        value={search$}
                        className="border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring-blue-200 focus:outline-none px-3 py-2"
                        placeholder="e.g smoothie"
                        onInput={(e: Event) => search$.setValue((e.target as HTMLInputElement).value)}
                    />
                </div>

                <div className="flex flex-col justify-center">
                    <div className=''>
                        <h3 className="text-lg font-semibold">Filter</h3>
                    </div>
                    <fieldset className='flex flex-row gap-4'>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                type="radio"
                                id="most_popular"
                                className="form-radio text-blue-600"
                                checked={filter$.derive(filter => filter.mostPopular)}
                                name="sortBy"
                                onChange={(e: Event) => {
                                    filter$.setValue({
                                        mostPopular: (e.target as HTMLInputElement).checked,
                                        newest: false
                                    });
                                }}
                            />
                            <label
                                for="most_popular"
                                className="text-md mr-2 font-semibold">Most Popular
                            </label>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                type="radio"
                                className="form-radio text-blue-600"
                                checked={filter$.derive(filter => filter.newest)}
                                name="sortBy"
                                id="newest"
                                onChange={
                                    (e: Event) => {
                                        filter$.setValue({
                                            mostPopular: false,
                                            newest: (e.target as HTMLInputElement).checked
                                        });
                                    }
                                }
                            />
                            <label
                                for="newest"
                                className="text-md mr-2 font-semibold">Newest
                            </label>

                        </div>

                    </fieldset>
                </div>
            </div>
            <div className='w-60 flex flex-col gap-4'>
                <button className='font-bold py-2 px-4' onClick={() => {
                    search$.setValue('');
                    filter$.setValue({ mostPopular: false, newest: false });
                }}>
                    Clear Filters
                </button>
            </div>

        </div>
    );
}

function RecipesGrid({ recipes$ }: { recipes$: Signal<Recipe[]> }) {
    return (
        <For
            as='div'
            asProps={{ className: 'flex flex-wrap justify-around gap-4' }}
            list={recipes$}
            index={(recipe) => recipe.id}
            factory={(recipe) => <RecipeCard {...recipe} />}
        />
    );
}

function RecipeCard(props: Recipe) {
    return (<a
        router-link
        className='flex flex-col uppercase'
        href={`/recipes/${props.id}`}
    >
        <img src={props.image} alt={props.title} className={'w-60 h-80'} />
        <h3>{props.title}</h3>
    </a>);
}