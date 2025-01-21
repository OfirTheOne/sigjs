import { Link } from "@sigjs/sig/router";
import './Layout.scss';

function NavBar() {
    return (
        <div className="nav-header">
            <div className="nav-container">
                <div className="logo-section">
                    <h1 className="brand">Sig.JS</h1>
                </div>
                <nav className="nav-links">
                    <Link to="/playground">Playground</Link>
                    <Link to="/about">About</Link>
                </nav>
            </div>
        </div>
    );
}

export function Layout() {
    return (<div>
        <NavBar />
        <main className="main-content">
            <router-outlet />
        </main>
    </div>);
}