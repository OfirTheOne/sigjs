import { For, Signal } from 'sig';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../types/recipe';

interface RecipeGridProps {
  recipes$: Signal<Recipe[]>;
}

export function RecipeGrid({ recipes$ }: RecipeGridProps) {
  return (
        <For 
            as='div'
            asProps={{ className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }} 
            list={recipes$}
            index={(recipe) => recipe.id}
            factory={(recipe) => <RecipeCard recipe={recipe} />}
        />
  );
}