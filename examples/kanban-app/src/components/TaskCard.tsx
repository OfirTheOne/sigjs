import { Task } from '../types';
import { mockUsers } from '../data';
import { Trophy, GripVertical } from 'lucide';
import { createSignal, For, Signal } from '@sigjs/sig';
import { lucideSigjs } from '../lucide-adapter/lucide-adapter';

const TrophyComponent = lucideSigjs(Trophy)
const GripVerticalComponent = lucideSigjs(GripVertical)


interface TaskCardProps {
    task$: Signal<Task>;
    onAssigneeChange: (taskId: string, userId: number) => void;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
}

export function TaskCard({ task$, onAssigneeChange }: TaskCardProps) {
    const [showCompletion$, setShowCompletion] = createSignal(false);
    const [particles$, setParticles] = createSignal<Particle[]>([]);

    const colors = ['#FFD700', '#FFA500', '#FF6B6B', '#4CAF50', '#64B5F6'];

    const taskStatus$ = task$.select('status');

    taskStatus$.subscribe(taskStatus => {
        if (taskStatus === 'done') {
            setShowCompletion(true);
            // Create confetti particles
            const newParticles = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 200 - 100, // spread horizontally
                y: -(Math.random() * 150 + 50), // fall from top
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => {
                setShowCompletion(false);
                setParticles([]);
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setShowCompletion(false);
            setParticles([]);
        }
    });

    const handleDragStart = (e) => {
        e.dataTransfer.setData('taskId', task$.value.id);
    };

    return (
        <div
            draggable="true"
            onDragStart={handleDragStart}
            className={[`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3`,
                `cursor-move hover:shadow-md transition-all duration-300 relative overflow-hidden group`,
                taskStatus$.derive<string>(status => status === 'done' ? 'border-green-500' : '')
            ]}
        >
            {/* Drag Handle */}
            <div className="absolute top-2 right-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                <GripVerticalComponent size={16} className="opacity-75" />
            </div>

            {/* Confetti particles */}
            <For
                list={particles$}
                factory={(particle) => (
                    <div
                        className="absolute pointer-events-none animate-[confetti_2s_ease-out_forwards]"
                        style={{
                            left: '50%',
                            top: '50%',
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            transform: `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}
                    />)}
            />

            {/* Trophy celebration */}
            <div className={[`absolute inset-0 flex items-center justify-center transition-all duration-500 transform pointer-events-none`,
                showCompletion$.derive<string>(showCompletion => showCompletion ? 'opacity-50' : 'opacity-0')]}>
                <div className="relative">
                    {/* <TrophyComponent className={[`text-yellow-400 w-16 h-16 filter drop-shadow-lg transition-all duration-500 transform`,
                        showCompletion$.derive<string>(showCompletion => showCompletion ? 'animate-[trophy_2s_ease-out_forwards]' : 'scale-0')]} /> */}
                    <div className={[`absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 
                    to-transparent animate-[shine_1s_ease-in-out_infinite]`,
                        showCompletion$.derive<string>(showCompletion => showCompletion ? 'opacity-50' : 'opacity-0')]} />
                </div>
            </div>

            <div className={`transition-opacity duration-300 ${showCompletion$ ? 'opacity-80' : 'opacity-100'}`}>
                <h3 className="font-semibold text-gray-800 mb-2">{task$.select('title')}</h3>
                <p className="text-sm text-gray-600 mb-3">{task$.select('description')}</p>

                <div className="flex items-center justify-between">
                    <select
                        value={String(task$.value.assignee?.id) || ''}
                        onChange={(e) => onAssigneeChange(task$.value.id, Number(e.target.value))}
                        className="text-sm border rounded-md px-2 py-1 bg-gray-50"
                    >
                        <option value="">Unassigned</option>
                        {mockUsers.map((user) => (
                            <option value={String(user.id)}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    {task$.value.assignee && (
                        <img
                            src={task$.value.assignee.avatar}
                            alt={task$.value.assignee.name}
                            className="w-8 h-8 rounded-full ml-2"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}