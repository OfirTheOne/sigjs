import { combineLatest } from 'sig';
import { store } from '../store';
import { SearchBar } from '../components/SearchBar';
import { RecipeGrid } from '../components/RecipeGrid';

export function Recipes() {

    const recipes$ = store.select(state => state.recipes);
    const searchQuery$ = store.select(state => state.searchQuery);
    const selectedCategory$ = store.select(state => state.selectedCategory);
    const setSearchQuery = store.getState().setSearchQuery;

    const filteredRecipes$ = combineLatest([recipes$, searchQuery$, selectedCategory$])
    .derive(([recipes, searchQuery, selectedCategory]) => {
        return recipes.filter((recipe) => {
            const matchesSearch = !searchQuery || recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    });

    return (
        <div>
            <div className="mb-8">
                <SearchBar value$={searchQuery$} onChange={setSearchQuery} />
            </div>
            <RecipeGrid recipes$={filteredRecipes$} />
        </div>
    );
}