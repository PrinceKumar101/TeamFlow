import { useMemo } from "react";
import { useAppSelector } from "./redux";
import type { ProjectItem, ProjectRole } from "@/types/project";

/**
 * Given a project, returns the current user's project-level role
 * (PO | PM | DEVELOPER) or null if they are not a member.
 * Also exposes the user's global role (ADMIN | USER).
 */
export function useProjectRole(project: ProjectItem | undefined) {
  const user = useAppSelector((s) => s.auth.user);

  return useMemo(() => {
    const globalRole = user?.role ?? null; // "ADMIN" | "USER" | null
    const isAdmin = globalRole === "ADMIN";

    if (!project || !user) {
      return { projectRole: null as ProjectRole | null, globalRole, isAdmin };
    }

    const membership = project.members.find(
      (m) => m.user._id === user.id,
    );

    const projectRole: ProjectRole | null = membership?.role ?? null;

    return { projectRole, globalRole, isAdmin };
  }, [project, user]);
}

/** Quick permission helpers — ADMIN always has full access */
export function canCreateTask(
  projectRole: string | null,
  globalRole?: string | null,
) {
  if (globalRole === "ADMIN") return true;
  return projectRole === "PO" || projectRole === "PM";
}

export function canDeleteTask(
  projectRole: string | null,
  globalRole?: string | null,
) {
  if (globalRole === "ADMIN") return true;
  return projectRole === "PO" || projectRole === "PM";
}

export function canUpdateAnyTask(
  projectRole: string | null,
  globalRole?: string | null,
) {
  if (globalRole === "ADMIN") return true;
  return projectRole === "PO" || projectRole === "PM";
}

export function canUpdateAssignedTask(
  projectRole: string | null,
  taskAssignedToId: string,
  currentUserId: string,
  globalRole?: string | null,
) {
  if (globalRole === "ADMIN") return true;
  if (projectRole === "PO" || projectRole === "PM") return true;
  if (projectRole === "DEVELOPER" && taskAssignedToId === currentUserId)
    return true;
  return false;
}

export function canCreateProject(globalRole: string | null) {
  return globalRole === "ADMIN";
}

export function canAssignMembers(
  globalRole: string | null,
  projectRole?: string | null,
) {
  if (globalRole === "ADMIN") return true;
  return projectRole === "PO" || projectRole === "PM";
}
