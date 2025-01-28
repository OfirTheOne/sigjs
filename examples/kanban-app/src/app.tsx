

import { Column } from './components/Column';
import { NewTaskModal } from './components/NewTaskModal';
import { Task } from './types';
import { initialTasks, mockUsers } from './data';
import { Plus } from 'lucide';
import { createSignal, If } from '@sigjs/sig';
import { lucideSigjs } from './lucide-adapter/lucide-adapter';

const PlusComponent = lucideSigjs(Plus)

const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' as const },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' as const },
    { id: 'review', title: 'Review', status: 'review' as const },
    { id: 'done', title: 'Done', status: 'done' as const },
    
];

export function App() {
    const [tasks$, setTasks] = createSignal<Task[]>(initialTasks);
    const [showNewTaskModal$, setShowNewTaskModal] = createSignal(false);

    const tasksByStatus = Object.fromEntries(columns.map(column => [
        column.status, 
        tasks$.derive(tasks => tasks.filter(task => task.status === column.status))
    ]));

    const handleDrop = (taskId: string, newStatus: Task['status']) => {
        setTasks(tasks => tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    };

    const handleAssigneeChange = (taskId: string, userId: number) => {
        setTasks(tasks => tasks.map(task =>
            task.id === taskId
                ? { ...task, assignee: mockUsers.find(u => u.id === userId) || null }
                : task
        ));
    };

    const handleNewTask = (taskData: Omit<Task, 'id'>) => {
        const newTask: Task = {
            ...taskData,
            id: Math.random().toString(36).substr(2, 9),
        };
        setTasks([...tasks$.value, newTask]);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
                    <button
                        onClick={() => setShowNewTaskModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        <PlusComponent size={20} />
                        New Task
                    </button>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4">
                    {columns.map(column => (
                        <Column
                            column={column}
                            tasks$={tasksByStatus[column.status]}
                            onDrop={handleDrop}
                            onAssigneeChange={handleAssigneeChange}
                        />
                    ))}
                </div>
            </div>

            <If
                condition={showNewTaskModal$}
                then={
                    <NewTaskModal
                        onClose={() => setShowNewTaskModal(false)}
                        onSubmit={handleNewTask}
                    />
                }
            />

        </div>
    );
}