
import { Store } from '@sigjs/sig/store';

function logMiddleware(newState, state, store) {
    console.log('new state:', newState);
    console.log('old state:', state);
}

export const store = new Store({
    count: 0,
    user: null,
    users: [],
}, [logMiddleware]);

export function increment() {
    store.setState((state) => ({ ...state, count: state.count + 1 }));
}