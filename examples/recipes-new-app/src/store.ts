import { Store } from 'sig/store';
import type { Recipe } from './types/recipe';

interface RecipeStore {
    categories: {
        id: string;
        name: string;
        image: string;
    }[],
    recipes: Recipe[];
    searchQuery: string;
    selectedCategory: string | null;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    addComment: (recipeId: string, comment: { author: string; content: string }) => void;
}

export const store = new Store<RecipeStore>({
    categories: [
        { id: 'italian', name: 'Italian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b' },
        { id: 'asian', name: 'Asian', image: 'https://images.unsplash.com/photo-1512003867696-6d5ce6835040' },
        { id: 'mexican', name: 'Mexican', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f' },
        { id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777' },
    ],
    recipes: [
        {
            id: '1',
            title: 'Classic Margherita Pizza',
            category: 'Italian',
            description: 'A traditional Neapolitan pizza with fresh ingredients',
            ingredients: ['Pizza dough', 'San Marzano tomatoes', 'Fresh mozzarella', 'Fresh basil', 'Olive oil'],
            instructions: [
                'Preheat oven to 500°F (260°C)',
                'Roll out the pizza dough',
                'Add tomato sauce',
                'Top with fresh mozzarella',
                'Bake for 12-15 minutes',
                'Garnish with fresh basil'
            ],
            prepTime: '30 mins',
            cookTime: '15 mins',
            servings: 4,
            images: [
                'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
                'https://images.unsplash.com/photo-1585238342024-78d387f4a707'
            ],
            comments: []
        },
        {
            id: '2',
            title: 'Pad Thai',
            category: 'Asian',
            description: 'Authentic Thai stir-fried rice noodles with shrimp',
            ingredients: [
                'Rice noodles',
                'Shrimp',
                'Bean sprouts',
                'Eggs',
                'Peanuts',
                'Tamarind sauce',
                'Fish sauce',
                'Palm sugar'
            ],
            instructions: [
                'Soak rice noodles in warm water',
                'Prepare tamarind sauce mixture',
                'Stir-fry shrimp until pink',
                'Add beaten eggs',
                'Add noodles and sauce',
                'Toss with bean sprouts and peanuts'
            ],
            prepTime: '20 mins',
            cookTime: '15 mins',
            servings: 2,
            images: [
                'https://images.unsplash.com/photo-1559314809-0d155014e29e',
                'https://images.unsplash.com/photo-1626804475297-41608ea09aeb'
            ],
            comments: []
        },
        {
            id: '3',
            title: 'Beef Tacos',
            category: 'Mexican',
            description: 'Authentic Mexican street tacos with seasoned beef',
            ingredients: [
                'Ground beef',
                'Corn tortillas',
                'White onion',
                'Fresh cilantro',
                'Lime wedges',
                'Taco seasoning'
            ],
            instructions: [
                'Season ground beef with taco seasoning',
                'Cook beef until browned',
                'Warm tortillas',
                'Assemble tacos with meat, onion, and cilantro',
                'Serve with lime wedges'
            ],
            prepTime: '15 mins',
            cookTime: '20 mins',
            servings: 4,
            images: [
                'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
                'https://images.unsplash.com/photo-1613514785940-daed77c5f5fd'
            ],
            comments: []
        },
        {
            id: '4',
            title: 'Tiramisu',
            category: 'Desserts',
            description: 'Classic Italian coffee-flavored dessert',
            ingredients: [
                'Ladyfinger cookies',
                'Mascarpone cheese',
                'Strong coffee',
                'Eggs',
                'Sugar',
                'Cocoa powder'
            ],
            instructions: [
                'Prepare strong coffee and let cool',
                'Beat egg yolks with sugar',
                'Mix in mascarpone cheese',
                'Dip ladyfingers in coffee',
                'Layer cookies and cream mixture',
                'Dust with cocoa powder',
                'Refrigerate for 4 hours'
            ],
            prepTime: '30 mins',
            cookTime: '0 mins',
            servings: 8,
            images: [
                'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
                'https://images.unsplash.com/photo-1542124948-dc391252a940'
            ],
            comments: []
        },
        {
            id: '5',
            title: 'Sushi Rolls',
            category: 'Asian',
            description: 'Fresh California rolls with crab and avocado',
            ingredients: [
                'Sushi rice',
                'Nori sheets',
                'Crab meat',
                'Avocado',
                'Cucumber',
                'Sesame seeds'
            ],
            instructions: [
                'Cook and season sushi rice',
                'Place nori on bamboo mat',
                'Spread rice on nori',
                'Add fillings',
                'Roll tightly',
                'Cut into pieces'
            ],
            prepTime: '45 mins',
            cookTime: '20 mins',
            servings: 3,
            images: [
                'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
                'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56'
            ],
            comments: []
        },
        {
            id: '6',
            title: 'Chocolate Lava Cake',
            category: 'Desserts',
            description: 'Decadent chocolate dessert with a molten center',
            ingredients: [
                'Dark chocolate',
                'Butter',
                'Eggs',
                'Sugar',
                'Flour',
                'Vanilla extract'
            ],
            instructions: [
                'Melt chocolate and butter',
                'Whisk eggs and sugar',
                'Combine mixtures',
                'Add flour',
                'Pour into ramekins',
                'Bake until edges are set but center is soft'
            ],
            prepTime: '15 mins',
            cookTime: '12 mins',
            servings: 4,
            images: [
                'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
                'https://images.unsplash.com/photo-1606313564200-e75d5e30476c'
            ],
            comments: []
        }
    ],
    searchQuery: '',
    selectedCategory: null,
    setSearchQuery: (query) => store.setState({ searchQuery: query }),
    setSelectedCategory: (category) => store.setState({ selectedCategory: category }),
    addComment: (recipeId, comment) =>
        store.setState((state) => ({
            recipes: state.recipes.map((recipe) =>
                recipe.id === recipeId
                    ? {
                        ...recipe,
                        comments: [
                            ...recipe.comments,
                            {
                                id: Date.now().toString(),
                                author: comment.author,
                                content: comment.content,
                                createdAt: new Date().toISOString(),
                            },
                        ],
                    }
                    : recipe
            ),
        })),
});