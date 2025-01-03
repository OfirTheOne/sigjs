import { createSignal, For, If } from 'sig';
import type { RouteComponentProps } from 'sig/router';
import Users from '/assets/icons/users.svg';
import Mail from '/assets/icons/mail.svg';
import Clock from '/assets/icons/clock.svg';
import Share2 from '/assets/icons/share2.svg';
import { store } from '../store';


export function Recipe({ params }: RouteComponentProps) {
    const { id } = params;
    const recipe$ = store
        .select((state) => state.recipes)
        .derive(recipes => recipes.find((r) => r.id === id));
    const addComment = store.getState().addComment

    const [comment$, setComment] = createSignal({ author: '', content: '' });

    const recipeImages$ = recipe$.derive(r => r.images)
    const commentAuthor$ = comment$.derive(c => c.author);
    const commentContent$ = comment$.derive(c => c.content);
    const recipeComments$ = recipe$.derive(r => r.comments)

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (comment$.value.author && comment$.value.content) {
            addComment(recipe$.value.id, comment$.value);
            setComment({ author: '', content: '' });
        }
    };

    return (
        <If 
            condition={recipe$} 
            fallback={<div>Recipe not found</div>}
            then={
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe$.derive(r => r.title)}</h1>
                        <p className="text-lg text-gray-600 mb-6">{recipe$.derive(r => r.description)}</p>
        
                        <div className="flex items-center space-x-6 mb-6">
                            <div className="flex items-center">
                                {Clock({ className: "h-5 w-5 text-gray-400 mr-2" })}
                                <span className="text-sm text-gray-600">
                                    Prep: {recipe$.derive(r => r.prepTime)} | Cook: {recipe$.derive(r => r.cookTime)}
                                </span>
                            </div>
                            <div className="flex items-center">
                                {Users({ className: "h-5 w-5 text-gray-400 mr-2" })}
                                <span className="text-sm text-gray-600">Serves {recipe$.derive(r => r.servings)}</span>
                            </div>
                        </div>
        
                        <div className="flex space-x-4">
                            <button
                                // onClick={() => shareViaWhatsApp(recipe.title, window.location.href)}
                                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                                {Share2({ className: "h-5 w-5 mr-2" })}
                                WhatsApp
                            </button>
                            <button
                                // onClick={() => shareViaEmail(recipe.title, window.location.href)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                {Mail({ className: "h-5 w-5 mr-2" })}
                                Email
                            </button>
                        </div>
                    </div>
                    <For
                        as='div'
                        asProps={{ className: "grid grid-cols-2 gap-4 mb-8" }}
                        list={recipeImages$}
                        // index={(image, index) => index}
                        factory={(image, index) => <img 
                            src={image} 
                            alt={`${recipe$.value.title} ${index + 1}`} 
                            className='rounded-lg shadow-md w-full h-64 object-cover'
                        />}
                    />
        
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                            <ul className="space-y-2">
        
                                {recipe$.value.ingredients.map((ingredient) => (
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </div>
        
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                            <ol className="space-y-4">
                                {recipe$.value.instructions.map((instruction, index) => (
                                    <li className="flex">
                                        <span className="font-bold text-indigo-500 mr-3">{index + 1}.</span>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
        
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={commentAuthor$}
                                    onChange={(e) => setComment((currentComment) => ({ ...currentComment, author: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                            <div className="mb-4">
                                <textarea
                                    placeholder="Your comment"
                                    value={commentContent$}
                                    onChange={(e) => setComment((currentComment) => ({ ...currentComment, content: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    rows={4}
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Add Comment
                            </button>
                        </form>
                            <For
                                as='div'
                                asProps={{ className: "space-y-6" }}
                                list={recipeComments$}
                                factory={(comment) => (
                                    <div className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                                            <span className="text-sm text-gray-500">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{comment.content}</p>
                                    </div>
                                )}
                            />
                    </div>
                </div>
            }
        />
            

    );
}