export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee: User | null;
  createdAt: Date;
  subtasks: SubTask[];
}

export interface Column {
  id: string;
  title: string;
  status: Task["status"];
}
export type SortOption = "title" | "assignee" | "date";
