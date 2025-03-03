import { ArrowUpDown, Type, User, Calendar } from 'lucide';
import { combineLatest, createSignal, For, Signal } from '@sigjs/sig';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task, SortOption } from '../types';
import { lucideSigjs } from '../lucide-adapter/lucide-adapter';
import { store } from '../store/store';

const TypeComponent = lucideSigjs(Type);
const UserComponent = lucideSigjs(User);
const ArrowUpDownComponent = lucideSigjs(ArrowUpDown);
const CalendarComponent = lucideSigjs(Calendar);

function getSortedTasks$(
  tasks$: Signal<Task[]>,
  sortBy$: Signal<SortOption>,
  sortDirection$: Signal<'asc' | 'desc'>
): Signal<Task[]> {
  return combineLatest([tasks$, sortBy$, sortDirection$]).derive(
    ([tasks, sortBy, sortDirection]) => {
      return [...tasks].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'assignee':
            const aName = a.assignee?.name || '';
            const bName = b.assignee?.name || '';
            comparison = aName.localeCompare(bName);
            break;
          case 'date':
            comparison = a.createdAt!.getTime() - b.createdAt!.getTime();
            break;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
  );
}

const getSortButtonClass = (sortBy$: Signal<SortOption>, option: SortOption) => [
  'p-1 rounded-md transition-colors',
  sortBy$.derive<string>((by) =>
    by === option ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'
  ),
];

interface ColumnProps {
  column: ColumnType;
  tasks$: Signal<Task[]>;
  isShrunk$: Signal<boolean>;
  onDrop: (taskId: string, status: Task['status']) => void;
  onAssigneeChange: (taskId: string, userId: string) => void;
}

export function Column({ column, tasks$, onDrop, onAssigneeChange, isShrunk$ }: ColumnProps) {
  const [sortBy$, setSortBy] = createSignal<SortOption>('title');
  const [sortDirection$, setSortDirection] = createSignal<'asc' | 'desc'>('desc');
  const sortedTasks$ = getSortedTasks$(tasks$, sortBy$, sortDirection$);
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const cardBeingDragged$ = store.select(s => s.cardBeingDragged);

  const handleDrop = (e) => {
    e.preventDefault();
    if(store.getState().cardBeingDragged)
      store.setState({ cardBeingDragged: false });
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, column.status);
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy$() === option) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(option);
      setSortDirection('asc');
    }
  };

  return (
    <div
      className={[" p-4 rounded-lg w-80", 
          cardBeingDragged$.derive<string>((card) => card ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100')
      ]}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg mb-4 text-gray-700">{column.title}</h2>
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => toggleSort('date')}
            className={getSortButtonClass(sortBy$, 'date')}
            title="Sort by date"
          >
            <CalendarComponent size={16} />
          </button>
          <button
            onClick={() => toggleSort('title')}
            className={getSortButtonClass(sortBy$, 'title')}
            title="Sort by title"
          >
            <TypeComponent size={16} />
          </button>
          <button
            onClick={() => toggleSort('assignee')}
            className={getSortButtonClass(sortBy$, 'assignee')}
            title="Sort by assignee"
          >
            <UserComponent size={16} />
          </button>
          <div className="text-gray-400 px-1">
            <ArrowUpDownComponent size={16} className={`transform transition-transform`} />
          </div>
        </div>
      </div>
      <For
        provideItemSignal={false}
        list={sortedTasks$}
        index={'id'}
        factory={(task) => (
          <div className={'space-y-3'}>
            <TaskCard taskId={task.id} onAssigneeChange={onAssigneeChange} isShrunk$={isShrunk$} />
          </div>
        )}
      />
    </div>
  );
}
