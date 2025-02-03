export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  assignee: User | null;
  createdAt?: Date;
}

export interface Column {
  id: string;
  title: string;
  status: Task["status"];
}
export type SortOption = "title" | "assignee" | "date";
