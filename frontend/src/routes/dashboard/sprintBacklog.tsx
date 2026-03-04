import { createFileRoute } from "@tanstack/react-router";
import { IconTargetArrow } from "@tabler/icons-react";
import { SprintList } from "@/components/dashboard/sprint/sprint-list";
import { CreateSprintDialog } from "@/components/dashboard/dialogs/create-sprint-dialog";
import { CreateTaskDialog } from "@/components/dashboard/dialogs/create-task-dialog";
import { CreateProjectDialog } from "@/components/dashboard/dialogs/create-project-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useAppSelector } from "@/hooks/redux";

export const Route = createFileRoute("/dashboard/sprintBacklog")({
  component: SprintBacklogPage,
});

function SprintBacklogPage() {
  const sprints = useAppSelector((state) => state.sprints.sprints);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const projects = useAppSelector((state) => state.projects.projects);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconTargetArrow className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
              Sprint Backlog
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Plan and manage your sprints
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {projects.length > 0 && tasks.length > 0 && <CreateSprintDialog />}
          {projects.length > 0 && <CreateTaskDialog />}
          {projects.length === 0 && <CreateProjectDialog />}
        </div>
      </div>

      {/* Sprint list or empty state */}
      {sprints.length === 0 ? (
        <EmptyState
          icon={IconTargetArrow}
          title="No sprints yet"
          description={
            tasks.length === 0
              ? "Create some tasks first, then organize them into sprints."
              : "Create a sprint to start organizing your tasks into iterations."
          }
          action={
            <div className="flex gap-2">
              {tasks.length === 0 && projects.length > 0 && (
                <CreateTaskDialog />
              )}
              {tasks.length === 0 && projects.length === 0 && (
                <CreateProjectDialog />
              )}
              {tasks.length > 0 && <CreateSprintDialog />}
            </div>
          }
        />
      ) : (
        <SprintList />
      )}
    </div>
  );
}
