
import "./Counter.scss";
import { createSignal } from "@sigjs/sig";

export function CounterCard() {
    const [count$, setCount] = createSignal(0);
    const [countAnimation$, setCountAnimation] = createSignal<string>('');
    const handleCount = (increment: boolean) => {
      setCount(c => increment ? c + 1 : c - 1);
      setCountAnimation(increment ? 'up' : 'down');
      setTimeout(() => setCountAnimation(''), 500);
    };
  
    return (<div className="fun-card">
      <h3>Bouncy Counter</h3>
      <div 
        className={[`counter`, countAnimation$]}>{count$}</div>
      <div className="counter-buttons">
        <button onClick={() => handleCount(false)}>-</button>
        <button onClick={() => handleCount(true)}>+</button>
      </div>
    </div>);
  }
  