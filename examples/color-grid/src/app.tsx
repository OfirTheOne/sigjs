import { createSignal, If, Signal } from "@sigjs/sig";

// Heavy computation component that runs on every render
const HeavyComputationComponent = ({ mousePosition }: { mousePosition: Signal<{ x: number; y: number }> }) => {
  // Expensive calculation that runs on every render
  const fibonacci = (n: number): number => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  };

  // Force expensive calculations on every render
  const result = fibonacci(40);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold mb-2">Heavy Computation Results</h3>
      <p className="text-xs text-gray-600">Fibonacci(40): {result}</p>
      <p className="text-xs text-gray-600">
        Mouse Position: ({mousePosition.select('x')}, {mousePosition.select('y')})
      </p>
    </div>
  );
};

const ColorSquare = ({ color, onMouseMove }: { color: string; onMouseMove: (e: MouseEvent) => void; }) => {
  return (
    <div
      className="w-24 h-24 cursor-pointer transition-transform hover:scale-105"
      style={{ backgroundColor: color }}
      onMouseMove={onMouseMove}
    />
  );
};

const ColorPreview = ({ color, position }: { color: Signal<string>; position: Signal<{ x: number; y: number }>; }) => {
  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-xl p-4 pointer-events-none"
      style={{
        left: position.select('x', x => `${x + 16}px`),
        top: position.select('y', y => `${y + 16}px`),
      }}
    >
      <div className="space-y-2">
        <div 
          className="w-32 h-32 rounded-md" 
          style={{ backgroundColor: color }}
        />
        <p className="text-sm font-mono text-center">{color}</p>
      </div>
    </div>
  );
};

export function App() {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [hoveredColor, setHoveredColor] = createSignal<string | null>(null);

  // Generate a grid of colors
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71',
    '#F1C40F', '#1ABC9C', '#D35400', '#34495E', '#16A085',
    '#27AE60', '#2980B9', '#8E44AD', '#F39C12', '#C0392B',
  ];

  const handleMouseMove = (e: MouseEvent, color: string) => {
    // Update position on every mouse movement
    setMousePosition({ x: e.clientX, y: e.clientY });
    setHoveredColor(color);
  };

  const handleMouseLeave = () => {
    setHoveredColor(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-2xl font-bold mb-4">Color Grid Performance Demo</h1>
          <p className="text-gray-600 mb-6">
            Move your mouse over the colors to see performance issues. Notice how the entire UI
            becomes sluggish due to unnecessary heavy calculations being performed on every
            mouse movement.
          </p>
        </div>

        <div 
          className="grid grid-cols-5 gap-4 bg-white p-8 rounded-lg shadow-lg"
          onMouseLeave={handleMouseLeave}
        >
          {colors.map((color) => (
            <ColorSquare
              color={color}
              onMouseMove={(e) => handleMouseMove(e, color)}
            />
          ))}
        </div>

        {/* Heavy computation component that re-renders on every mouse movement */}
        <HeavyComputationComponent mousePosition={mousePosition} />

        {/* Color preview that follows the mouse */}
        <If
            condition={hoveredColor}
            then={(
            <ColorPreview
                color={hoveredColor}
                position={mousePosition}
            />
        )}/>
      </div>
    </div>
  );
}