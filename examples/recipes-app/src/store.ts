import { Store } from 'sig/store';
import { Recipe } from './types';


export const store = new Store({
    recipes: <Recipe[]>[],
    fetchRecipes: async () => {
        const res = await fetch('http://localhost:3030/recipes');
        const recipes = await res.json();
        store.setState({ recipes });
    }
});