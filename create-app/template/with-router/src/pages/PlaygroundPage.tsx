import './PlaygroundPage.scss';
import { createSignal } from "@sigjs/sig";

const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];


export function PlaygroundPage() {
  const [count$, setCount] = createSignal(0);
  const [countAnimation$, setCountAnimation] = createSignal<string>('');
  const [color$, setColor] = createSignal(colors[0]);
  const [isPlaying$, setIsPlaying] = createSignal(false);

  const handleCount = (increment: boolean) => {
    setCount(c => increment ? c + 1 : c - 1);
    setCountAnimation(increment ? 'up' : 'down');
    setTimeout(() => setCountAnimation(''), 500);
  };

  const randomColor = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setColor(newColor);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Welcome to the Sig.JS Playground!
      </h1>
      
      <div className="playground">
        <div className="fun-card">
          <h3>Bouncy Counter</h3>
          <div 
            style={{ color: color$ }}
            className={[`counter`, countAnimation$]}>{count$}</div>
          <div className="counter-buttons">
            <button onClick={() => handleCount(false)}>-</button>
            <button onClick={() => handleCount(true)}>+</button>
          </div>
        </div>

        <div className="fun-card">
          <h3>Color Changer</h3>
          <div 
            className="color-box" 
            style={{ 
              backgroundColor: color$,
              transform: 'rotate(5deg)',
              cursor: 'pointer'
            }}
            onClick={randomColor}
          />
          <p>Click the box to change color!</p>
        </div>

        <div className="fun-card">
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
        </div>
      </div>
    </div>
  );
}