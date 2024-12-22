
import { Link } from 'sig/router';
import type { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipe/${recipe.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={recipe.images[0]}
          alt={recipe.title}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-200"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{recipe.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-indigo-600">{recipe.category}</span>
            <span className="text-sm text-gray-500">
              {recipe.prepTime} + {recipe.cookTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}