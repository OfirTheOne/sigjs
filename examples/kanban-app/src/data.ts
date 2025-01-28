import { User, Task } from './types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

const statuses = ['todo', 'in-progress', 'review', 'done'] as const;


export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Implement Authentication',
    description: 'Set up user authentication system',
    status: 'todo',
    assignee: mockUsers[0]
  },
  {
    id: '2',
    title: 'Design Homepage',
    description: 'Create wireframes for homepage',
    status: 'in-progress',
    assignee: mockUsers[1]
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Integrate backend APIs',
    status: 'review',
    assignee: mockUsers[2]
  },
  ...Array.from({ length: 50 }, (_, i) => {
    const status = statuses[i % statuses.length];
    return {
      id: `${i + 4}`,
      title: `Task ${i + 4}`,
      description: `Description for task ${i + 4}`,
      status: status,
      assignee: mockUsers[i % mockUsers.length]
    };
  })
];