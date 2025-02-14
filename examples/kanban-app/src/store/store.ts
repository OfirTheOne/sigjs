import { Store } from "@sigjs/sig/store";
import { mockUsers, initialTasks } from "../data";
import { SubTask, Task } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initialTasksMap = new Map(initialTasks.map((task) => [task.id, task]));

export const store = new Store({
  cardBeingDragged: false,
  users: mockUsers,
  tasks: initialTasksMap,
  selectedTask: null,
  selectedUser: null,
  fetchTasks: async () => {
    await delay(1000);
    store.setState({ tasks: initialTasksMap });
  },

  createTask: async (taskData: Omit<Task, "id">) => {
    await delay(1000);
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    store.setState({
      tasks: new Map(store.getState().tasks).set(newTask.id, newTask),
    });
  },

  updateTaskStatus: async (taskId: string, newStatus: Task["status"]) => {
    await delay(1000);
    const tasks = new Map(store.getState().tasks);
    const task = tasks.get(taskId);
    if (task) {
      tasks.set(taskId, { ...task, status: newStatus });
      store.setState({ tasks });
    }
  },

  updateTaskAssignee: async (taskId: string, userId: string) => {
    await delay(1000);
    const tasks = new Map(store.getState().tasks);
    const task = tasks.get(taskId);
    if (task) {
      tasks.set(taskId, {
        ...task,
        assignee: store.getState().users.find((u) => u.id === userId) || null,
      });
      store.setState({ tasks });
    }
  },

  addTaskSubtask: async (taskId: string, subtask: SubTask) => {
    await delay(1000);
    const tasks = new Map(store.getState().tasks);
    const task = tasks.get(taskId);
    if (task) {
      tasks.set(taskId, {
        ...task,
        subtasks: [...task.subtasks, subtask],
      });
      store.setState({ tasks });
    }
  },

  updateTaskSubtaskStatus: async (taskId: string, subtaskId: string, completed: boolean) => {
    await delay(1000);
    const tasks = new Map(store.getState().tasks);
    const task = tasks.get(taskId);
    if (task) {
      const subtasks = task.subtasks.map((subtask) => {
        if (subtask.id === subtaskId) {
          return { ...subtask, completed };
        }
        return subtask;
      });
      tasks.set(taskId, { ...task, subtasks });
      store.setState({ tasks });
    }
  },
})
.accessStateFunctionsWithStore();

/* 

TODO - add implementation to the Store class of withSelector method , that will receive a selector function as first arg and array of argument as second arg
return a signal that is selected by running the selector function with state and arguments
and with that the store signals can be "cached" across the app
*/
