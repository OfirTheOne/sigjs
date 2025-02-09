import { User, Task } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

const statuses = ["todo", "in-progress", "review", "done"] as const;

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Implement Authentication",
    description: "Set up user authentication system",
    status: "todo",
    assignee: mockUsers[0],
    createdAt: new Date("2023-01-01T10:00:00Z"),
    subtasks: [
      { id: "1-1", title: "Set up Auth0", completed: true },
      { id: "1-2", title: "Implement login flow", completed: false },
      { id: "1-3", title: "Add user roles", completed: false },
    ],
  },
  {
    id: "2",
    title: "Design Homepage",
    description: "Create wireframes for homepage",
    status: "in-progress",
    assignee: mockUsers[1],
    createdAt: new Date("2023-01-02T11:00:00Z"),
    subtasks: [
      { id: "2-1", title: "Create mockups", completed: true },
      { id: "2-2", title: "Get feedback", completed: true },
      { id: "2-3", title: "Implement design", completed: false },
    ],
  },
  {
    id: "3",
    title: "API Integration",
    description: "Integrate backend APIs",
    status: "review",
    assignee: mockUsers[2],
    createdAt: new Date("2023-01-03T12:00:00Z"),
    subtasks: [
      { id: "3-1", title: "Define endpoints", completed: true },
      { id: "3-2", title: "Write API client", completed: true },
      { id: "3-3", title: "Add error handling", completed: true },
    ],
  },
  ...Array.from({ length: 50 }, (_, i) => {
    const status = statuses[i % statuses.length];
    const day = (i % 28) + 1; // Cycle through days 1 to 28
    const month = Math.floor(i / 28) + 1; // Increment month every 28 days
    return {
      id: `${i + 4}`,
      title: `Task ${i + 4}`,
      description: `Description for task ${i + 4}`,
      status: status,
      assignee: mockUsers[i % mockUsers.length],
      createdAt: new Date(
        `2023-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T10:00:00Z`
      ),
      subtasks: [],
    };
  }),
];
