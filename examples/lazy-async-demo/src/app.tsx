
import { Switch, Case, Await } from "@sigjs/sig";
import { createSignal } from "@sigjs/sig";

function NavBar() {
    return (<div className="nav-header">
        <div className="nav-container">
            <div className="logo-section">
                <h1 className="brand">Sig.JS</h1>
            </div>
        </div>
    </div>);
}

export function App() {
    return (<div>
        <NavBar />
        <main className="main-content">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Hello Sig.JS</h1>
            <Tabs />
        </main>
    </div>);
}


const LazyHomeTab = () => import('./components/HomeTab');
const LazyAboutTab = () => import('./components/AboutTab');
const LazyProfileTab = () => import('./components/ProfileTab');

export const Tabs = () => {
    const [activeTab, setActiveTab] = createSignal("home-tab");
    return (
        <div>
            <div className="tabs">
                <button onClick={() => setActiveTab("home-tab")}>Home</button>
                <button onClick={() => setActiveTab("profile-tab")}>Profile</button>
                <button onClick={() => setActiveTab("about-tab")}>About</button>
            </div>
            <div className="tab-content">
                <Switch condition={activeTab}>
                    <Case value={"home-tab"}>
                        <Await component={LazyHomeTab} fallback={<div>Loading...</div>} />
                    </Case>
                    <Case value={"profile-tab"}>
                        <Await component={LazyProfileTab} fallback={<div>Loading...</div>} />
                    </Case>
                    <Case value={"about-tab"}>
                        <Await component={LazyAboutTab} fallback={<div>Loading...</div>} />
                    </Case>
                </Switch>
            </div>
        </div>
    );
};