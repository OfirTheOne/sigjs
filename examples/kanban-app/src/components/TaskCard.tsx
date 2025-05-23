import { combineLatest, createSignal, For, If, Signal } from "@sigjs/sig";
import { Property } from "@sigjs/sig/types";
import { SubTask, Task } from "../types";
import { mockUsers } from "../data";
import { icons } from "../icons";
import { store } from "../store/store";

const TrophyComponent = icons.Trophy;
const GripVerticalComponent = icons.GripVertical;
const ChevronRightComponent = icons.ChevronRight;
const CheckSquareComponent = icons.CheckSquare;
const SquareComponent = icons.Square;
const PlusComponent = icons.Plus;
const XComponent = icons.X;
const ChevronDownComponent = icons.ChevronDown;

interface TaskCardProps {
  taskId: string;
  isShrunk$: Signal<boolean>;
  onAssigneeChange: (taskId: string, userId: string) => void;
}

function onTaskStatus$(
  taskStatus$: Signal<Task["status"]>,
  task$: Signal<Task>,
  setShowCompletion: (show: boolean) => void
) {
  taskStatus$.subscribe((taskStatus) => {
    console.log("Task status changed:", taskStatus, task$()?.id);
    if (!taskStatus) return;
    if (taskStatus === "done") {
      setShowCompletion(true);
      const timer = setTimeout(() => {
        setShowCompletion(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowCompletion(false);
    }
  });
}

export function TaskCard({ taskId, onAssigneeChange, isShrunk$ }: TaskCardProps) {
  const [showCompletion$, setShowCompletion] = createSignal(false);
  const [isExpanded$, setIsExpanded] = createSignal(false);
  const [newSubtask$, setNewSubtask] = createSignal("");
  const [isAddingSubtask$, setIsAddingSubtask] = createSignal(false);
  const [isSubtasksCollapsed$, setIsSubtasksCollapsed] = createSignal(false);

  const task$ = store.select((state) => state.tasks.get(taskId));
  const taskStatus$ = task$.select("status");
  const taskTitle$ = task$.select("title");
  const assignee$ = task$.select("assignee");
  const subtasks$ = task$.select("subtasks");
  const subtasksLength$ = task$.select("subtasks", "length");
  const completedSubtasksLength$ = subtasks$.select(
    (subtasks) => subtasks.filter((st) => st.completed).length
  );

  const progress$ = completedSubtasksLength$.derive<Property.Width<string | number>>(
    (completed) => `${subtasks$().length > 0 ? (completed / subtasks$().length) * 100 : 0}%`
  );

  const showCompletionOpacity$ = showCompletion$.derive<string>((showCompletion) =>
    showCompletion ? "opacity-50" : "opacity-0"
  );

  const displayShrunkCard$ = combineLatest([isShrunk$, isExpanded$]).derive(
    ([isShrunk, isExpanded]) => isShrunk && !isExpanded
  );

  onTaskStatus$(taskStatus$, task$, setShowCompletion);

  const canAddSubtask$ = combineLatest([isAddingSubtask$, isSubtasksCollapsed$]).derive(
    ([isAddingSubtask, isSubtasksCollapsed]) => !isAddingSubtask && !isSubtasksCollapsed
  );

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task$().id);
    store.setState({ cardBeingDragged: true });
  };

  const toggleSubtask = (subtask: SubTask) => {
    store.updateTaskSubtaskStatus(task$().id, subtask.id, !subtask.completed);
    // You would typically update this through a prop
  };

  const addSubtask = () => {
    if (!newSubtask$().trim()) return;

    const newSubtaskItem: SubTask = {
      id: `${task$().id}-${subtasks$().length + 1}`,
      title: newSubtask$().trim(),
      completed: false,
    };

    // You would typically update this through a prop
    console.log("New subtask:", newSubtaskItem);

    setNewSubtask("");
    setIsAddingSubtask(false);
  };

  const assigneeImageElement = (
    <If
      condition={assignee$}
      then={
        <img
          src={assignee$.select("avatar")}
          alt={assignee$.select("name")}
          className="w-8 h-8 rounded-full ml-2"
        />
      }
    />
  );
  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      className={[
        `bg-white rounded-lg shadow-sm border border-gray-200 mb-3`,
        `cursor-move hover:shadow-md transition-all duration-300 relative overflow-hidden group`,
        displayShrunkCard$.derive<string>((isShrunk) => (isShrunk ? "px-4 group" : "p-4")),
        taskStatus$.derive<string>((status) => (status === "done" ? "border-green-500" : "")),
      ]}
      onClick={() => isShrunk$() && setIsExpanded((prev) => !prev)}
    >
      {/* Drag Handle */}
      <div className="absolute top-6 right-3 text-gray-300 group-hover:text-gray-400 transition-colors">
        <GripVerticalComponent size={16} className="opacity-75" />
      </div>

      {/* Trophy celebration */}
      <div
        className={[
          `absolute inset-0 flex items-center justify-center transition-all duration-500 transform pointer-events-none`,
          showCompletionOpacity$,
        ]}
      >
        <div className="relative">
          <If
            condition={showCompletion$}
            then={
              <TrophyComponent
                className={`text-yellow-400 w-16 h-16 filter drop-shadow-lg
                        transition-all duration-500 transform animate-[trophy_2s_ease-out_forwards]`}
              />
            }
            fallback={
              <TrophyComponent
                className={`text-yellow-400 w-16 h-16 filter drop-shadow-lg
                        transition-all duration-500 transform scale-0}`}
              />
            }
          />
          <div
            className={[
              `absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent animate-[shine_1s_ease-in-out_infinite]`,
              showCompletionOpacity$,
            ]}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar progress$={progress$} />

      <If
        condition={displayShrunkCard$}
        then={
          <div className="p-3 flex items-center justify-between group">
            <ShrunkTaskCard
              taskTitle$={taskTitle$}
              assigneeImageElement={assigneeImageElement}
              completedSubtasksLength$={completedSubtasksLength$}
              subtasksLength$={subtasksLength$}
            />
          </div>
        }
        fallback={
          <ExpendedTaskCard
            task$={task$}
            taskTitle$={taskTitle$}
            assignee$={assignee$}
            subtasks$={subtasks$}
            subtasksLength$={subtasksLength$}
            completedSubtasksLength$={completedSubtasksLength$}
            showCompletion$={showCompletion$}
            isSubtasksCollapsed$={isSubtasksCollapsed$}
            setIsSubtasksCollapsed={setIsSubtasksCollapsed}
            isAddingSubtask$={isAddingSubtask$}
            setIsAddingSubtask={setIsAddingSubtask}
            newSubtask$={newSubtask$}
            setNewSubtask={setNewSubtask}
            canAddSubtask$={canAddSubtask$}
            addSubtask={addSubtask}
            onAssigneeChange={onAssigneeChange}
            toggleSubtask={toggleSubtask}
          />
        }
      />
    </div>
  );
}

function ProgressBar({ progress$ }: { progress$: Signal<Property.Width<string | number>> }) {
  return (
    <div className="h-1 w-full bg-gray-100">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: progress$ }}
      />
    </div>
  );
}

function ShrunkTaskCard({
  taskTitle$,
  assigneeImageElement,
  completedSubtasksLength$,
  subtasksLength$,
}: {
  taskTitle$: Signal<string>;
  assigneeImageElement: JSX.Element;
  completedSubtasksLength$: Signal<number>;
  subtasksLength$: Signal<number>;
}) {
  return (
    <>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">{taskTitle$}</p>
          <p className="text-sm text-gray-500">
            {completedSubtasksLength$}/{subtasksLength$} subtasks
          </p>
        </div>
        {assigneeImageElement}
      </div>
      <ChevronRightComponent
        size={16}
        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </>
  );
}

function ExpendedTaskCard({
  task$,
  taskTitle$,
  assignee$,
  subtasks$,
  subtasksLength$,
  completedSubtasksLength$,
  showCompletion$,
  isSubtasksCollapsed$,
  setIsSubtasksCollapsed,
  isAddingSubtask$,
  setIsAddingSubtask,
  newSubtask$,
  setNewSubtask,
  canAddSubtask$,
  addSubtask,
  onAssigneeChange,
  toggleSubtask,
}: {
  task$: Signal<Task>;
  taskTitle$: Signal<string>;
  assignee$: Signal<Task["assignee"]>;
  subtasks$: Signal<SubTask[]>;
  subtasksLength$: Signal<number>;
  completedSubtasksLength$: Signal<number>;
  showCompletion$: Signal<boolean>;
  isSubtasksCollapsed$: Signal<boolean>;
  setIsSubtasksCollapsed: (value: boolean) => void;
  isAddingSubtask$: Signal<boolean>;
  setIsAddingSubtask: (value: boolean) => void;
  newSubtask$: Signal<string>;
  setNewSubtask: (value: string) => void;
  canAddSubtask$: Signal<boolean>;
  addSubtask: () => void;
  onAssigneeChange: (taskId: string, userId: string) => void;
  toggleSubtask: (subtask: SubTask) => void;
}) {
  return (
    <div
      className={[
        "transition-opacity duration-300",
        showCompletion$.derive<string>((show) => (show ? "opacity-80" : "opacity-100")),
      ]}
    >
      <h3 className="font-semibold text-gray-800 mb-2">{taskTitle$}</h3>
      <p className="text-sm text-gray-600 mb-3">{task$.select("description")}</p>
      {/* Subtasks Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSubtasksCollapsed(!isSubtasksCollapsed$());
            }}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <ChevronDownComponent
              size={16}
              // className={`transition-transform ${isSubtasksCollapsed$ ? "-rotate-90" : ""}`}
              className={[`transition-transform`, isSubtasksCollapsed$.derive(y => y ? "-rotate-90" : "")]}
            />
            <span>
              Subtasks ({completedSubtasksLength$}/{subtasksLength$})
            </span>
          </button>
          <If
            condition={canAddSubtask$}
            then={
              <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingSubtask(true);
              }}
              className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
              >
                <PlusComponent size={14} />
                Add
            </button>
            }
          />
        </div>

        <div
          className={[
            `overflow-hidden transition-all duration-300`,
            isSubtasksCollapsed$.derive<string>((c) =>
              c ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
            ),
          ]}
        >
          {/* Add New Subtask Input */}
          <AddNewSubtask
            isAddingSubtask$={isAddingSubtask$}
            setIsAddingSubtask={setIsAddingSubtask}
            newSubtask$={newSubtask$}
            setNewSubtask={setNewSubtask}
            addSubtask={addSubtask}
          />

          {/* Subtasks List */}
          <SubtaskList subtasks$={subtasks$} toggleSubtask={toggleSubtask} />
        </div>
      </div>

      <SelectAssignee assignee$={assignee$} task$={task$} onAssigneeChange={onAssigneeChange} />

      <p className="text-xs text-gray-500 mt-2">
        Created At: {task$.select("createdAt", (date) => date.toLocaleString())}
      </p>
    </div>
  );
}

function SelectAssignee({
  assignee$,
  task$,
  onAssigneeChange,
}: {
  assignee$: Signal<Task["assignee"]>;
  task$: Signal<Task>;
  onAssigneeChange: (taskId: string, userId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <select
        value={assignee$.select("id")}
        onChange={(e) => {
          e.preventDefault();
          onAssigneeChange(task$.value.id, e.target.value);
        }}
        className="text-sm border rounded-md px-2 py-1 bg-gray-50"
      >
        <option value="">Unassigned</option>
        {mockUsers.map((user) => (
          <option value={user.id}>{user.name}</option>
        ))}
      </select>
      <If
        condition={assignee$}
        then={
          <img
            src={assignee$.select("avatar")}
            alt={assignee$.select("name")}
            className="w-8 h-8 rounded-full ml-2"
          />
        }
      />
    </div>
  );
}

function AddNewSubtask({
  isAddingSubtask$,
  newSubtask$,
  setNewSubtask,
  setIsAddingSubtask,
  addSubtask,
}: {
  isAddingSubtask$: Signal<boolean>;
  newSubtask$: Signal<string>;
  setNewSubtask: (value: string) => void;
  setIsAddingSubtask: (value: boolean) => void;
  addSubtask: () => void;
}) {
  return (
    <If
      condition={isAddingSubtask$}
      then={
        <div className={`flex gap-2 mb-2`} onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={newSubtask$}
            onChange={(e) => setNewSubtask(e.target.value)}
            placeholder="Enter subtask..."
            className="flex-1 text-sm border rounded-md px-2 py-1"
            autofocus
          />
          <button
            onClick={addSubtask}
            className="px-2 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAddingSubtask(false);
              setNewSubtask("");
            }}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <XComponent size={16} />
          </button>
        </div>
      }
    />
  );
}

function SubtaskList({
  subtasks$,
  toggleSubtask,
}: {
  subtasks$: Signal<SubTask[]>;
  toggleSubtask: (subtask: SubTask) => void;
}) {
  return (
    <For
      list={subtasks$}
      index={"id"}
      factory={({ item$ }) => {
        const completed$ = item$.select("completed");
        return (
          <div className="space-y-1" >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSubtask(item$());
              }}
              className="w-full flex items-center gap-2 p-1 hover:bg-gray-50 rounded text-left group/item"
            >
              <If
                condition={completed$}
                then={<CheckSquareComponent size={16} className="text-blue-500" />}
                fallback={<SquareComponent size={16} className="text-gray-400" />}
              />
              <span
                className={[
                  `text-sm flex-1`,
                  completed$.derive<string>((c) =>
                    c ? "text-gray-500 line-through" : "text-gray-700"
                  ),
                ]}
              >
                {item$.select("title")}
              </span>
            </button>
          </div>
        );
      }}
    />
  );
}
