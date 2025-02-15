import { createSignal, createRef, For, If, onConnect, onDisconnect } from '@sigjs/sig/core';
import type { Property, Signal } from '@sigjs/sig';

interface Pipe {
    id: number;
    height: number;
    x: number;
}

// Constants - Adjusted for better gameplay
const GRAVITY = 0.4;
const JUMP_FORCE = -7;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 150;
const PIPE_GAP = 160;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const TERMINAL_VELOCITY = 8;

function Bird(
    { birdPosition$, velocity$ }:
        { birdPosition$: Signal<number>; velocity$: Signal<number> }) {
    return (
        <div
            className="absolute w-8 h-8 left-[70px] transition-transform duration-50"
            style={{
                top: birdPosition$.derive<Property.Top<string | number>>(p => `${p}px`),
                transform: velocity$.derive(v =>
                    `translateY(-50%) rotate(${v * 3}deg)`),
            }}
        >
            <div className="w-full h-full bg-yellow-400 rounded-full relative">
                <div className="absolute w-2 h-2 bg-black rounded-full right-2 top-2" />
            </div>
        </div>
    );
}

function Pipes({ pipes$ }: { pipes$: Signal<Pipe[]> }) {
    return (<For
        provideItemSignal={true}
        list={pipes$}
        index="id"
        factory={(_pipe, _1, _2, pipe$) => (<>
            {/* Top pipe */}
            <div
                className="absolute w-[50px] bg-green-600"
                style={{
                    left: pipe$.derive<Property.Left<string | number>>(p => `${p?.x}px`),
                    height: pipe$.derive<Property.Height<string | number>>(p => `${p?.height}px`),
                    top: 0,
                }}
            >
                <div className="absolute bottom-0 left-[-5px] w-[60px] h-5 bg-green-600" />
            </div>
            {/* Bottom pipe */}
            <div
                className="absolute w-[50px] bg-green-600"
                style={{
                    left: pipe$.derive<Property.Left<string | number>>(p => `${p?.x}px`),
                    height: pipe$.derive<Property.Height<string | number>>(p => `${GAME_HEIGHT - p?.height - PIPE_GAP}px`),
                    top: pipe$.derive<Property.Top<string | number>>(p => `${p?.height + PIPE_GAP}px`),
                }}
            >
                <div className="absolute top-0 left-[-5px] w-[60px] h-5 bg-green-600" />
            </div>
        </>)}
    />);
}

function Score({ score$ }: { score$: Signal<number> }) {
    return (<div className="absolute top-4 left-4 text-2xl font-bold">
        Score: {score$}
    </div>);
}

export function App() {
    const [gameStarted$, setGameStarted] = createSignal(false);
    const [score$, setScore] = createSignal(0);
    const [gameOver$, setGameOver] = createSignal(false);
    const [birdPosition$, setBirdPosition] = createSignal(250);
    const [pipes$, setPipes] = createSignal<Pipe[]>([]);
    const [velocity$, setVelocity] = createSignal(0);
    const frameRef = createRef(0);
    const gameLoopRef = createRef<number>();

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            if (gameOver$()) {
                resetGame();
            } else {
                jump();
            }
        }
    };
    onConnect(() => {
        window.addEventListener('keydown', handleKeyPress);
    });

    onDisconnect(() => {
        window.removeEventListener('keydown', handleKeyPress);
        if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current);
        }
    });

    const jump = () => {
        if (!gameOver$()) {
            setVelocity(JUMP_FORCE);
            if (!gameStarted$()) {
                setGameStarted(true);
            }
        }
    };

    const resetGame = () => {
        setBirdPosition(250);
        setVelocity(0);
        setPipes([]);
        frameRef.current = 0;
        setScore(0);
        setGameOver(false);
        setGameStarted(false);
    };

    gameStarted$.subscribe(() => {
        if (!gameStarted$() || gameOver$()) return;
        const gameLoop = () => {
            // Update bird position
            if (!gameStarted$() || gameOver$()) return;

            setVelocity(Math.min(velocity$() + GRAVITY, TERMINAL_VELOCITY));
            setBirdPosition(prev => {
                const newPosition = prev + velocity$();

                // Check boundaries
                if (newPosition > GAME_HEIGHT - 30 || newPosition < 0) {
                    setGameOver(true);
                    return prev;
                }
                return newPosition;
            });

            // Spawn new pipes
            if (frameRef.current % PIPE_SPAWN_RATE === 0) {
                const height = Math.random() * (GAME_HEIGHT - PIPE_GAP - 200) + 100;
                setPipes(prev => [...prev, { height, id: Date.now(), x: GAME_WIDTH }]);
            }

            // Update pipes and check collisions
            setPipes(prev => {
                return prev
                    .map(pipe => ({
                        ...pipe,
                        x: pipe.x - PIPE_SPEED,
                    }))
                    .filter(pipe => {
                        // Check collision
                        if (
                            pipe.x < 120 && pipe.x > 20 &&
                            (birdPosition$() < pipe.height || birdPosition$() > pipe.height + PIPE_GAP)
                        ) {
                            setGameOver(true);
                        }

                        // Update score
                        if (pipe.x === 20) {
                            setScore(s => s + 1);
                        }

                        return pipe.x > -60;
                    });
            });

            frameRef.current++;
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        };
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    });

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div
                className="relative w-[800px] h-[600px] bg-sky-300 overflow-hidden border-4 border-gray-700 rounded-lg"
            >
                <Bird birdPosition$={birdPosition$} velocity$={velocity$} />
                <Pipes pipes$={pipes$} />
                <Score score$={score$} />
                {/* Game messages */}
                <If
                    condition={gameStarted$.derive(s => !s)}
                    then={<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-xl font-bold text-center py-3 px-8 rounded">
                        Press SPACE to jump
                    </div>}
                />
                <If
                    condition={gameOver$}
                    then={<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-xl font-bold text-center py-3 px-8 rounded">
                        Game Over!
                        Press SPACE to restart
                    </div>}
                />
            </div>
            <p className="text-white mt-4 text-center">Press SPACE to jump/start</p>
        </div>
    );
}
