import { getRouter } from '@sigjs/sig/router';
import { store } from '../store';
import { For, onConnect, onDisconnect } from '@sigjs/sig/core';

export function Categories() {

    onConnect((ctx) => {
        console.log('Categories connected');
        console.log(ctx);
    });

    onDisconnect(() => {
        console.log('Categories disconnected');
    });

    const router = getRouter();
    const categories$ = store.select((state) => state.categories);

    const handleCategoryClick = (category: string) => {
        store.getState().setSelectedCategory(category);
        router.push('/recipes');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Recipe Categories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <For
                    list={categories$}
                    index={(category) => category.id}
                    factory={({item: category}) =>
                        <div
                            onClick={() => handleCategoryClick(category.name)}
                            className="cursor-pointer group"
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                                </div>
                            </div>
                        </div>
                    }></For>
            </div>
        </div>
    );
}