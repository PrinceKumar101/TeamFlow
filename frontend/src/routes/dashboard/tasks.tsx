import { createFileRoute } from "@tanstack/react-router";
import { IconLayoutKanban } from "@tabler/icons-react";
import { TaskBoard } from "@/components/dashboard/backlogs/task-board";
import { CreateTaskDialog } from "@/components/dashboard/dialogs/create-task-dialog";
import { CreateProjectDialog } from "@/components/dashboard/dialogs/create-project-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useAppSelector } from "@/hooks/redux";

export const Route = createFileRoute("/dashboard/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const projects = useAppSelector((state) => state.projects.projects);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconLayoutKanban className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
              Task Board
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Visualize and manage task progress
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {projects.length === 0 && <CreateProjectDialog />}
          {projects.length > 0 && <CreateTaskDialog />}
        </div>
      </div>

      {/* Board or empty state */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={IconLayoutKanban}
          title="No tasks yet"
          description={
            projects.length === 0
              ? "Create a project first, then add tasks to see them on the board."
              : "Create tasks to see them organized by status on the board."
          }
          action={
            <div className="flex gap-2">
              {projects.length === 0 && <CreateProjectDialog />}
              {projects.length > 0 && <CreateTaskDialog />}
            </div>
          }
        />
      ) : (
        <TaskBoard />
      )}
    </div>
  );
}
