import { Task } from '../types';
import { mockUsers } from '../data';
import { X } from 'lucide';
import { createSignal } from '@sigjs/sig';
import { lucideSigjs } from '../lucide-adapter/lucide-adapter';

const XComponent = lucideSigjs(X)

interface NewTaskModalProps {
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id'>) => void;
}

export function NewTaskModal({ onClose, onSubmit }: NewTaskModalProps) {
    const [title$, setTitle] = createSignal('');
    const [description$, setDescription] = createSignal('');
    const [assigneeId$, setAssigneeId] = createSignal<string>('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const assignee = mockUsers.find(u => u.id === Number(assigneeId$.value)) || null;
        onSubmit({
            title: title$(),
            description: description$(),
            status: 'todo',
            assignee
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">New Task</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XComponent size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title$}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description$}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            rows={3}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Assignee</label>
                        <select
                            value={assigneeId$}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            <option value="">Unassigned</option>
                            {mockUsers.map((user) => (
                                <option value={String(user.id)}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}