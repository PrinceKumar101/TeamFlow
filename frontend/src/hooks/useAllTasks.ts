import { useQueries } from "@tanstack/react-query";
import { getTasksByProject } from "@/api/tasks.api";
import { useProjects, projectKeys } from "./useProjects";
import type { TaskItem, ProjectItem } from "@/types/project";

export interface TaskWithProject extends TaskItem {
  projectName: string;
}

/**
 * Fetches tasks for every project the current user has access to,
 * then flattens + annotates them with the project name.
 */
export function useAllTasks() {
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const taskQueries = useQueries({
    queries: projects.map((p: ProjectItem) => ({
      queryKey: projectKeys.tasks(p._id),
      queryFn: async () => {
        const res = await getTasksByProject(p._id);
        return (res.data ?? []).map((t: TaskItem) => ({
          ...t,
          projectName: p.name,
        }));
      },
      enabled: !!p._id,
    })),
  });

  const isLoading =
    projectsLoading || taskQueries.some((q) => q.isLoading);
  const isError = taskQueries.some((q) => q.isError);
  const tasks: TaskWithProject[] = taskQueries.flatMap(
    (q) => q.data ?? [],
  );

  return { tasks, projects, isLoading, isError };
}
