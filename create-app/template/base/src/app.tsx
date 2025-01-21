
import { CounterCard } from "./components/Counter";

function NavBar() {
    return (
        <div className="nav-header">
            <div className="nav-container">
                <div className="logo-section">
                    <h1 className="brand">Sig.JS</h1>
                </div>
            </div>
        </div>
    );
}

export function App() {
    return (<div>
        <NavBar />
        <main className="main-content">
            <CounterCard />
        </main>
    </div>);
}
