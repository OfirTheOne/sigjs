export interface User {
    id: number;
    name: string;
    avatar: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'review' | 'done';
    assignee: User | null;
  }
  
  export interface Column {
    id: string;
    title: string;
    status: Task['status'];
  }