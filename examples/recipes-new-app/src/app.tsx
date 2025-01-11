import { createRouter, Navigate } from "sig/router"
import { Layout } from "./components/Layout"
import { Categories } from "./pages/Categories";
import { Recipe } from "./pages/Recipe";
import { Recipes } from "./pages/Recipes";
// import { createSignal } from "sig";


export function App() {
    return <AppRouter />
    // <div className={'flex flex-col items-center justify-center h-screen'}>
    //     <MouseMovementPad randomFactor={42} />
    // </div>
}


const AppRouter = () => createRouter({
    routes: [
        { 
            path: '/', component: () => <Layout />,
            children: [
                { index: true, component: () => <Navigate to="/categories" />, memo: false },
                { path: '/categories', component: Categories },
                { path: '/recipes', component: Recipes, memo: false },
                { path: '/recipe/:id', component: Recipe }
            ]
        }
    ]
});


// interface MouseMovementPadProps {
//     randomFactor: number   
// }
// function MouseMovementPad(props: MouseMovementPadProps) {
//     const [random, setRandom] = createSignal('');

//     return (<div className={'w-3/4 border border-blue-800 p-2'}>
//         <p className={'text-xs min-h-8 break-all'}>{random}</p>
//         <div className={'p-2 w-full h-32 bg-blue-200 '} 
//             onMouseMove={(e) => {
//                 const randomMovement = (props.randomFactor * (e.screenX + e.screenY)) % 127;
//                 const hex = randomMovement.toString(16);
//                 setRandom(prev => prev + hex);
//             }}></div>
//     </div>);
// }