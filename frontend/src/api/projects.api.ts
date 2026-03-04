import api from "./axiosSetup";
import type {
  AddMemberPayload,
  ApiResponse,
  CreateProjectPayload,
  MemberInfo,
  ProjectItem,
} from "@/types/project";

// ─── Projects ─────────────────────────────────────────────────────

export const createProject = async (
  data: CreateProjectPayload,
): Promise<ApiResponse<ProjectItem>> => {
  const res = await api.post<ApiResponse<ProjectItem>>("/projects", data);
  return res.data;
};

export const getProjects = async (): Promise<ApiResponse<ProjectItem[]>> => {
  const res = await api.get<ApiResponse<ProjectItem[]>>("/projects");
  return res.data;
};

export const getProjectById = async (
  projectId: string,
): Promise<ApiResponse<ProjectItem>> => {
  const res = await api.get<ApiResponse<ProjectItem>>(
    `/projects/${projectId}`,
  );
  return res.data;
};

// ─── Members ──────────────────────────────────────────────────────

export const addMember = async (
  projectId: string,
  data: AddMemberPayload,
): Promise<ApiResponse<ProjectItem>> => {
  const res = await api.patch<ApiResponse<ProjectItem>>(
    `/projects/${projectId}/add-member`,
    data,
  );
  return res.data;
};

// ─── Users ────────────────────────────────────────────────────────

export const getAllUsers = async (): Promise<ApiResponse<MemberInfo[]>> => {
  const res = await api.get<ApiResponse<MemberInfo[]>>("/auth/users");
  return res.data;
};
