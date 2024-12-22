export interface Recipe {
    id: string;
    title: string;
    category: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
    cookTime: string;
    servings: number;
    images: string[];
    comments: Comment[];
}

export interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}