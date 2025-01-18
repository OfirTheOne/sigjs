
import "./Counter.scss";
import { createSignal } from "@sigjs/sig";
import Logo from "/assets/sig-logo.svg";

export function Counter() {
    const [count$, setCount] = createSignal(0);
    const[animation$, setAnimation]= createSignal('');

    const handleCount = (increment: boolean) => {
      setAnimation(increment ? 'bounce-up' : 'bounce-down');
      setCount(prev => prev + (increment ? 1 : -1));
      setTimeout(() => setAnimation(''), 300);
    };

    return (
        <div className="container">
            <div className="logo-container">
                <img src={Logo} alt="Sig.JS Logo" />
                <h1 className="title">ig.JS</h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="counter-card">
                    <h2>Interactive Counter</h2>
                    <div className={['counter-value', animation$]}>{count$}</div>
                    <div className="counter-buttons">
                        <button onClick={() => handleCount(false)}>Decrement</button>
                        <button onClick={() => handleCount(true)}> Increment </button>
                    </div>

                </div>
            </div>
        </div>
    );
}