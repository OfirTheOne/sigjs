
// import { onConnect } from 'sig';
// import { store } from './store';
import { AppRouter } from './router/router';


export function App() {
    // onConnect(() => {
    //     console.log('App connected');
    //     fetch('http://localhost:3030/recipes')
    //         .then(res => res.json())
    //         .then(recipes => store.setState((state) =>({ ...state, recipes })) );
    // });
    return <AppRouter />;
}


