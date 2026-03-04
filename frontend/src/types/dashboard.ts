export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";
export type SprintStatus = "planning" | "active" | "completed";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  projectId: string;
  dueDate: string;
  tags: string[];
  subtasks: SubTask[];
  sprintId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description: string;
  createdAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  taskIds: string[];
  createdAt: string;
}

export interface Activity {
  id: string;
  user: string;
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
}

export interface DashboardStats {
  totalTasks: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
