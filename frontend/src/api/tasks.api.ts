import api from "./axiosSetup";
import type {
  ApiResponse,
  CreateTaskPayload,
  TaskItem,
  UpdateTaskStatusPayload,
} from "@/types/project";

// ─── Tasks ────────────────────────────────────────────────────────

export const createTask = async (
  projectId: string,
  data: CreateTaskPayload,
): Promise<ApiResponse<TaskItem>> => {
  const res = await api.post<ApiResponse<TaskItem>>(
    `/projects/${projectId}/tasks`,
    data,
  );
  return res.data;
};

export const getTasksByProject = async (
  projectId: string,
): Promise<ApiResponse<TaskItem[]>> => {
  const res = await api.get<ApiResponse<TaskItem[]>>(
    `/projects/${projectId}/tasks`,
  );
  return res.data;
};

export const getSingleTask = async (
  projectId: string,
  taskId: string,
): Promise<ApiResponse<TaskItem>> => {
  const res = await api.get<ApiResponse<TaskItem>>(
    `/projects/${projectId}/tasks/${taskId}`,
  );
  return res.data;
};

export const updateTaskStatus = async (
  projectId: string,
  taskId: string,
  data: UpdateTaskStatusPayload,
): Promise<ApiResponse<TaskItem>> => {
  const res = await api.patch<ApiResponse<TaskItem>>(
    `/projects/${projectId}/tasks/${taskId}/status`,
    data,
  );
  return res.data;
};

export const deleteTask = async (
  projectId: string,
  taskId: string,
): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(
    `/projects/${projectId}/tasks/${taskId}`,
  );
  return res.data;
};
