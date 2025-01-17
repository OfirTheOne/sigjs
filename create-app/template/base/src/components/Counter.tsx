
import { createSignal } from "@sigjs/sig";

export function Counter() {
    const [count$, setCount] = createSignal(0);
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div>{count$}</div>
            <button
                onClick={() => setCount((count) => count + 1)}
                className="p-2 bg-indigo-600 text-white rounded-md"
            >
                Increment
            </button>
        </div>
    );
}