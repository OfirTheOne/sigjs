import { Store } from 'sig/store';
import { Recipe } from './types';


export const store = new Store({
    recipes: <Recipe[]>[] 
});