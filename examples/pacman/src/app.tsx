// import { Ghost } from 'lucide-react';
import { Case, combineLatest, createSignal, For, If, onConnect, Property, Switch } from '@sigjs/sig';

// Define maze layout
// 0 = wall, 1 = dot, 2 = empty, 3 = power pellet
const initialMaze = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
  [0, 3, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 3, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 3, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

type Position = {
  x: number;
  y: number;
};

type GhostType = {
  position: Position;
  color: string;
};

const CELL_SIZE = 32; // Size of each cell in pixels

export const Pacman = () => {

  const mazeSignalMatrix = initialMaze.map(row => row.map(cell => createSignal(cell)[0]));
  const [pacmanPos$, setPacmanPos] = createSignal<Position>({ x: 7, y: 5 }); // Center of the maze
  const [direction$, setDirection] = createSignal<string>('right');
  const [score$, setScore] = createSignal(0);
  const [gameOver$, setGameOver] = createSignal(false);
  const [ghosts$, setGhosts] = createSignal<GhostType[]>([
    { position: { x: 1, y: 1 }, color: 'bg-red-500' },    // Top left
    { position: { x: 13, y: 1 }, color: 'bg-pink-400' },  // Top right
    { position: { x: 1, y: 9 }, color: 'bg-cyan-400' },   // Bottom left
    { position: { x: 13, y: 9 }, color: 'bg-orange-400' }, // Bottom right
  ]);
  const [isPowerMode$, setIsPowerMode] = createSignal(false);

  const checkCollision = () => {
    const collision = ghosts$().some(ghost =>
      ghost.position.x === pacmanPos$().x && ghost.position.y === pacmanPos$().y
    );

    if (collision && !isPowerMode$()) {
      setGameOver(true);
    } else if (collision && isPowerMode$()) {
      // Remove the ghost that was eaten
      setGhosts(prevGhosts =>
        prevGhosts.filter(ghost =>
          !(ghost.position.x === pacmanPos$().x && ghost.position.y === pacmanPos$().y)
        )
      );
      setScore(prev => prev + 200); // Bonus points for eating a ghost
    }
  };

  const resetGame = () => {
    mazeSignalMatrix.forEach((row, y) => row.forEach((cell, x) => cell.setValue(initialMaze[y][x])));
    setPacmanPos({ x: 7, y: 5 }); // Reset to center
    setDirection('right');
    setScore(0);
    setGameOver(false);
    setGhosts([
      { position: { x: 1, y: 1 }, color: 'bg-red-500' },    // Top left
      { position: { x: 13, y: 1 }, color: 'bg-pink-400' },  // Top right
      { position: { x: 1, y: 9 }, color: 'bg-cyan-400' },   // Bottom left
      { position: { x: 13, y: 9 }, color: 'bg-orange-400' }, // Bottom right
    ]);
    setIsPowerMode(false);
  };

  onConnect(() => {
    if (gameOver$()) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const newPos = { ...pacmanPos$() };

      switch (e.key) {
        case 'ArrowUp':
          if (mazeSignalMatrix[pacmanPos$().y - 1]?.[pacmanPos$().x]() !== 0) {
            newPos.y -= 1;
            setDirection('up');
          }
          break;
        case 'ArrowDown':
          if (mazeSignalMatrix[pacmanPos$().y + 1]?.[pacmanPos$().x]() !== 0) {
            newPos.y += 1;
            setDirection('down');
          }
          break;
        case 'ArrowLeft':
          if (mazeSignalMatrix[pacmanPos$().y][pacmanPos$().x - 1]() !== 0) {
            newPos.x -= 1;
            setDirection('left');
          }
          break;
        case 'ArrowRight':
          if (mazeSignalMatrix[pacmanPos$().y][pacmanPos$().x + 1]() !== 0) {
            newPos.x += 1;
            setDirection('right');
          }
          break;
      }

      if (newPos.x !== pacmanPos$().x || newPos.y !== pacmanPos$().y) {
        if (mazeSignalMatrix[newPos.y][newPos.x]() === 1) {
          mazeSignalMatrix[newPos.y][newPos.x].setValue(2);
          setScore(score$() + 10);
        } else if (mazeSignalMatrix[newPos.y][newPos.x]() === 3) {
          mazeSignalMatrix[newPos.y][newPos.x].setValue(2);
          setScore(score$() + 50);
          setIsPowerMode(true);
          setTimeout(() => setIsPowerMode(false), 10000);
        }
        setPacmanPos(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  ghosts$.subscribe(() => {
    let moveGhosts: NodeJS.Timeout;
    if (gameOver$()){
      clearInterval(moveGhosts);
      return;
    }

    if (ghosts$().length === 0) {
      return
    }
    moveGhosts = setInterval(() => {
      if (ghosts$().length === 0) {
        clearInterval(moveGhosts);
        return
      }
      setGhosts(prevGhosts =>
        prevGhosts.map(ghost => {
          const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
          ].filter(dir =>
            mazeSignalMatrix[ghost.position.y + dir.y]?.[ghost.position.x + dir.x]() !== 0
          );

          const randomDir = directions[Math.floor(Math.random() * directions.length)];
          return {
            ...ghost,
            position: {
              x: ghost.position.x + randomDir.x,
              y: ghost.position.y + randomDir.y,
            },
          };
        })
      );
    }, 1500);

    return () => clearInterval(moveGhosts);
  }, {
    emitOnSubscribe: true,
  });


  const anyMovement$ = combineLatest([pacmanPos$, ghosts$]);

  anyMovement$.subscribe(() => {
    if (!gameOver$()) {
      checkCollision();
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-8">
      <div className="mb-4 text-white text-2xl">Score: {score$}</div>
      <div className="relative bg-black p-4 rounded-lg shadow-xl">
        {
          mazeSignalMatrix.map((row) => (
            <div className="flex">
              {
                row.map((cell$) => (
                  <div
                    className={[
                      `w-8 h-8 flex items-center justify-center`,
                      cell$.derive(c => c === 0 ? 'bg-blue-800' : 'bg-black')
                    ]}
                  >
                    <Switch condition={cell$}>
                      <Case value={1}>
                        <div className="w-2 h-2 bg-yellow-200 rounded-full" />
                      </Case>
                      <Case value={3}>
                        <div className="w-4 h-4 bg-yellow-200 rounded-full animate-pulse" />
                      </Case>
                    </Switch>
                  </div>
                ))
              }
            </div>
          ))
        }

        {/* Pacman */}
        <div
          className="absolute transition-all duration-200"
          style={{
            top: pacmanPos$.derive<Property.Top<string | number>>(pos => `${pos.y * CELL_SIZE}px`),
            left: pacmanPos$.derive<Property.Left<string | number>>(pos => `${pos.x * CELL_SIZE}px`),
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: direction$.derive(dir => `rotate(${dir === 'right' ? '0deg' :
                dir === 'down' ? '90deg' :
                  dir === 'left' ? '180deg' :
                    '270deg'
              })`),
          }}
        >
          <div className="w-6 h-6 bg-yellow-400 rounded-full animate-chomp" />
        </div>

        {/* Ghosts */}
        <For
          list={ghosts$}
          provideItemSignal
          factory={(ghost, _1, _2, ghost$) => (
            <div
              className="absolute transition-all duration-200 flex items-center justify-center"
              style={{
                top: ghost$.select('position', 'y', y => `${y * CELL_SIZE}px` as Property.Top<string | number>),
                left: ghost$.select('position', 'x', x => `${x * CELL_SIZE}px` as Property.Left<string | number>),
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
              }}
            >
              <div
                className={[`w-6 h-6 rounded-full`, isPowerMode$.derive(y => y ? 'bg-blue-400' : ghost.color)]}
              />
            </div>
          )}
        />

        {/* Game Over Screen */}
        <If
          condition={gameOver$}
          then={(
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-red-500 text-4xl font-bold mb-4">Game Over!</h2>
                <p className="text-white text-xl mb-4">Final Score: {score$}</p>
                <button
                  onClick={resetGame}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Play Again
                </button>
              </div>
            </div>
          )} />
      </div>
    </div>
  );
};

export default Pacman;