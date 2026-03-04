import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  getProjectById,
  addMember,
  getAllUsers,
} from "@/api/projects.api";
import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
} from "@/api/tasks.api";
import type {
  AddMemberPayload,
  CreateProjectPayload,
  CreateTaskPayload,
  TaskStatus,
} from "@/types/project";

export const projectKeys = {
  all: ["projects"] as const,
  detail: (id: string) => ["projects", id] as const,
  tasks: (projectId: string) => ["projects", projectId, "tasks"] as const,
};

// ─── Fetch all projects ──────────────────────────────────────────
export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.all,
    queryFn: async () => {
      const res = await getProjects();
      return res.data;
    },
  });
};

// ─── Fetch single project ────────────────────────────────────────
export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: async () => {
      const res = await getProjectById(projectId);
      return res.data;
    },
    enabled: !!projectId,
  });
};

// ─── Fetch tasks for a project ───────────────────────────────────
export const useProjectTasks = (projectId: string) => {
  return useQuery({
    queryKey: projectKeys.tasks(projectId),
    queryFn: async () => {
      const res = await getTasksByProject(projectId);
      return res.data;
    },
    enabled: !!projectId,
  });
};

// ─── Create project ──────────────────────────────────────────────
export const useCreateProject = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectPayload) => createProject(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
};

// ─── Add member ──────────────────────────────────────────────────
export const useAddMember = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: AddMemberPayload;
    }) => addMember(projectId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({
        queryKey: projectKeys.detail(variables.projectId),
      });
    },
  });
};

// ─── Create task ─────────────────────────────────────────────────
export const useCreateTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateTaskPayload;
    }) => createTask(projectId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: projectKeys.tasks(variables.projectId),
      });
    },
  });
};

// ─── Update task status ──────────────────────────────────────────
export const useUpdateTaskStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      status,
    }: {
      projectId: string;
      taskId: string;
      status: TaskStatus;
    }) => updateTaskStatus(projectId, taskId, { status }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: projectKeys.tasks(variables.projectId),
      });
    },
  });
};

// ─── Delete task ─────────────────────────────────────────────────
export const useDeleteTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
    }: {
      projectId: string;
      taskId: string;
    }) => deleteTask(projectId, taskId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: projectKeys.tasks(variables.projectId),
      });
    },
  });
};

// ─── Fetch all registered users ──────────────────────────────────
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"] as const,
    queryFn: async () => {
      const res = await getAllUsers();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
