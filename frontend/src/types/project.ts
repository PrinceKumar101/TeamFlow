// ─── Enums matching backend ───────────────────────────────────────

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type ProjectRole = "PO" | "PM" | "DEVELOPER";

// ─── Project + Task types (matches backend response shapes) ───────

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

export interface MemberInfo {
  _id: string;
  name: string;
  email: string;
}

export interface ProjectMember {
  user: UserInfo;
  role: ProjectRole;
}

export interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  projectId: string;
  parentTaskId?: string | null;
  createdBy: UserInfo;
  assignedTo: UserInfo;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectItem {
  _id: string;
  name: string;
  description?: string;
  createdBy: UserInfo;
  members: ProjectMember[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── API payload types ────────────────────────────────────────────

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

export interface AddMemberPayload {
  email: string;
  role: ProjectRole;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  assignedTo: string;
  priority?: TaskPriority;
  dueDate?: string;
  parentTaskId?: string;
}

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}

// ─── Generic backend response wrapper ─────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
