import { createRouter } from "sig/router"
import { Layout } from "./components/Layout"
import { Categories } from "./pages/Categories";
import { Recipe } from "./pages/Recipe";
import { Recipes } from "./pages/Recipes";


export function App() {
    return <AppRouter />
}


const AppRouter = () => createRouter({
    routes: [
        { 
            path: '/', component: () => <Layout />,
            children: [
                { path: '/categories', component: Categories },
                { path: '/recipes', component: Recipes, memo: false },
                { path: '/recipe/:id', component: Recipe }
            ]
        }
    ]
});