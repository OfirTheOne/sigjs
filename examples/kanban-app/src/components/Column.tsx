import { For, Signal } from '@sigjs/sig';
import { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks$: Signal<Task[]>;
  onDrop: (taskId: string, status: Task['status']) => void;
  onAssigneeChange: (taskId: string, userId: number) => void;
}

export function Column({ column, tasks$, onDrop, onAssigneeChange }: ColumnProps) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, column.status);
  };

  return (
    <div
      className="bg-gray-100 p-4 rounded-lg w-80"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="font-bold text-lg mb-4 text-gray-700">{column.title}</h2>
      <For 
        as='div'
        provideItemSignal
        asProps={{className: 'space-y-3'}}
        list={tasks$}
        index={(task) => task.id}
        factory={(_task, _index, _tasksList, task$) => (
            <TaskCard
                task$={task$}
                onAssigneeChange={onAssigneeChange}
            />
        )}
    />
    </div>
  );
}