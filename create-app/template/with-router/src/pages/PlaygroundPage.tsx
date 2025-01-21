import './PlaygroundPage.scss';
import { createSignal, Signal } from "@sigjs/sig";

const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

function CounterCard( { color$ }: { color$: Signal<string> }) {
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
      style={{ color: color$ }}
      className={[`counter`, countAnimation$]}>{count$}</div>
    <div className="counter-buttons">
      <button onClick={() => handleCount(false)}>-</button>
      <button onClick={() => handleCount(true)}>+</button>
    </div>
  </div>
  );
}

function ColorChangerCard({ color$, onChangeColor }: {
  color$: Signal<string>, onChangeColor: () => void
}) {

  return (<div className="fun-card">
    <h3>Color Changer</h3>
    <div 
      className="color-box" 
      style={{ 
        backgroundColor: color$,
        transform: 'rotate(5deg)',
        cursor: 'pointer'
      }}
      onClick={onChangeColor}
    />
    <p>Click the box to change color!</p>
  </div>);
}

function BouncingBall({ color$ }: { color$: Signal<string> }) {
  const [isPlaying$, setIsPlaying] = createSignal(false);

  return (<div className="fun-card">
    <h3>Bouncing Ball</h3>
    <div className="ball-container">
      <div 
        className="ball"
        style={{ 
          animationPlayState: isPlaying$.derive(isPlaying => isPlaying ? 'running' : 'paused'),
          backgroundColor: color$ 
        }}
      />
    </div>
    <button 
      onClick={() => setIsPlaying(!(isPlaying$()))}
      style={{ 
        background: 'var(--primary)',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        cursor: 'pointer'
      }}
    >
      {isPlaying$.derive(isPlaying => isPlaying ? 'Pause' : 'Play')}
    </button>
  </div>);
}

export function PlaygroundPage() {
  const [color$, setColor] = createSignal(colors[0]);
  const randomColor = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(newColor);
  };
  
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Welcome to the Sig.JS Playground!
        <p>Explore the interactive components below to see how you can build dynamic web applications using Sig.JS. </p>
        <p>Navigate to the <strong>src/pages/PlaygroundPage.tsx</strong> file to see the code for this page.</p>
      </h1>
      <div className="playground">
        <CounterCard color$={color$} />
        <ColorChangerCard  color$={color$} onChangeColor={randomColor} />
        <BouncingBall color$={color$} />
      </div>
    </div>
  );
}