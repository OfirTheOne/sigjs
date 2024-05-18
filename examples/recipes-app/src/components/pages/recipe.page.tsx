import { SSR, Signal, createRef, createSignal } from 'sig';
import { getParams } from 'sig/router';

export function RecipePage() {
    const [renderOnCommentSubmit$] = createSignal<unknown>(0);
    const params = getParams();
    const recipeId = params.id;
    return (<SSR
        fetch={`/recipes/${recipeId}`}
        fallback={<p>Loading</p>}
        rerun={renderOnCommentSubmit$} >
        <SubmitCommentSection
            name='submit-comment'
            onSubmit$={renderOnCommentSubmit$}
            recipeId={recipeId} />
    </SSR>);
}

function SubmitCommentSection({ onSubmit$, recipeId }: {
    name: string
    onSubmit$: Signal<unknown>,
    recipeId: string
}) {
    const commentInputRef = createRef<HTMLInputElement>();
    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const comment = commentInputRef.current?.value;
        fetch(`http://localhost:3030/recipes/${recipeId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ author: 'Joni', comment }),
            headers: { 'Content-Type': 'application/json' }
        }).then(() => onSubmit$.emit(void 0));
    };

    return (<div className='flex flex-col w-1/2 gap-2'>
        <h3 className='text-xl font-semibold'>Submit a comment</h3>
        <textarea
            ref={commentInputRef}
            className='flex-1 min-h-16 border border-l-blue-200 rounded-md'
            name='comment'
            placeholder='Add a comment'
        />
        <button
            preventDefault
            className='bg-blue-500 text-white w-20 rounded'
            onClick={handleSubmit}>Submit</button>
    </div>);
}