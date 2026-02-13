export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: {
    name: string;
    avatar?: string;
  };
  project: string;
  projectColor: string;
  dueDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  project: string;
  timestamp: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  members: number;
}

export interface DashboardStats {
  totalTasks: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
