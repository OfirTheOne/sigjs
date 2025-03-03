import { For, Signal } from '@sigjs/sig';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../types/recipe';

interface RecipeGridProps {
  recipes$: Signal<Recipe[]>;
}

export function RecipeGrid({ recipes$ }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <For 
        list={recipes$}
        index={(recipe) => recipe.id}
        factory={(recipe) => <RecipeCard recipe={recipe} />}
      />
    </div>
  );
}