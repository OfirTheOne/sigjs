import { Task } from "../types";
import { mockUsers } from "../data";
import { Trophy, GripVertical, ChevronRight } from "lucide";
import { combineLatest, createSignal, If, Signal } from "@sigjs/sig";
import { lucideSigjs } from "../lucide-adapter/lucide-adapter";



const TrophyComponent = lucideSigjs(Trophy);
const GripVerticalComponent = lucideSigjs(GripVertical);
const ChevronRightComponent = lucideSigjs(ChevronRight);

interface TaskCardProps {
  task$: Signal<Task>;
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

export function TaskCard({
  task$,
  onAssigneeChange,
  isShrunk$,
}: TaskCardProps) {
  const [showCompletion$, setShowCompletion] = createSignal(false);
  const [isExpanded$, setIsExpanded] = createSignal(false);
  const taskStatus$ = task$.select("status");
  const taskTitle$ = task$.select("title");
  const assignee$ = task$.select("assignee");

  const showCompletionOpacity$ = showCompletion$.derive<string>(
    (showCompletion) => (showCompletion ? "opacity-50" : "opacity-0")
  );

  const displayShrunkCard$ = combineLatest([isShrunk$, isExpanded$]).derive(
    ([isShrunk, isExpanded]) => isShrunk && !isExpanded
  );

  onTaskStatus$(taskStatus$, task$, setShowCompletion);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task$.value.id);
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
        displayShrunkCard$.derive<string>((isShrunk) => isShrunk ? "px-4 group" : "p-4"),
        taskStatus$.derive<string>((status) =>status === "done" ? "border-green-500" : ""),
      ]}
      onClick={() => isShrunk$() && setIsExpanded((prev) => !prev)}
    >
      {/* Drag Handle */}
      <>
        <div className="absolute top-2 right-2 text-gray-300 group-hover:text-gray-400 transition-colors">
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
      </>
      <If
        as="div"
        asProps={{ className: "p-3 flex items-center justify-between group"}}
        condition={displayShrunkCard$}
        then={
            <>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate flex-1">
                      {taskTitle$}
                  </p>
                  {assigneeImageElement}
                </div>
                <ChevronRightComponent
                size={16}
                className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </>

        }
        fallback={
          <div
            className={[
              "transition-opacity duration-300",
              showCompletion$.derive<string>((show) =>
                show ? "opacity-80" : "opacity-100"
              ),
            ]}
          >
            <h3 className="font-semibold text-gray-800 mb-2">{taskTitle$}</h3>
            <p className="text-sm text-gray-600 mb-3">
              {task$.select("description")}
            </p>
            <div className="flex items-center justify-between">
              <select
                value={assignee$.select("id")}
                onChange={(e) =>{
                  e.preventDefault();
                  onAssigneeChange(task$.value.id, e.target.value)
                }}
                className="text-sm border rounded-md px-2 py-1 bg-gray-50"
              >
                <option value="">Unassigned</option>
                {mockUsers.map((user) => (
                  <option value={user.id}>{user.name}</option>
                ))}
              </select>
              {assigneeImageElement}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Created At:{" "}
              {task$.select("createdAt", (date) => date.toLocaleString())}
            </p>
          </div>
        }
      />
    </div>
  );
}
