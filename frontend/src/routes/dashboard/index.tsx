import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAppSelector } from "@/hooks/redux";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TaskList } from "@/components/dashboard/task-list";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { TaskDistributionChart } from "@/components/dashboard/task-distribution-chart";
import { CreateTaskDialog } from "@/components/dashboard/dialogs/create-task-dialog";
import { CreateProjectDialog } from "@/components/dashboard/dialogs/create-project-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { IconRocket } from "@tabler/icons-react";
import { isAfter, parseISO } from "date-fns";
import type { DashboardStats, ProjectSummary } from "@/types/dashboard";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const projects = useAppSelector((state) => state.projects.projects);
  const activities = useAppSelector((state) => state.activity.activities);

  const stats: DashboardStats = useMemo(() => {
    const now = new Date();
    return {
      totalTasks: tasks.length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) =>
          t.status !== "done" && isAfter(now, parseISO(t.dueDate))
      ).length,
    };
  }, [tasks]);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignee === "You"),
    [tasks]
  );

  const projectSummaries: ProjectSummary[] = useMemo(
    () =>
      projects.map((p) => {
        const projectTasks = tasks.filter((t) => t.projectId === p.id);
        return {
          id: p.id,
          name: p.name,
          color: p.color,
          totalTasks: projectTasks.length,
          completedTasks: projectTasks.filter((t) => t.status === "done")
            .length,
        };
      }),
    [projects, tasks]
  );

  const isEmpty = projects.length === 0 && tasks.length === 0;

  if (isEmpty) {
    return (
      <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.14),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.09),transparent_38%)]" />
        <DashboardHeader userName="User" />
        <EmptyState
          icon={IconRocket}
          title="Welcome to TeamFlow!"
          description="Get started by creating your first project, then add tasks to organize your work."
          action={
            <div className="flex gap-2">
              <CreateProjectDialog />
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.10),transparent_35%)]" />
      {/* Header */}
      <div className="rounded-2xl border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <DashboardHeader userName="User" />
          <div className="flex flex-wrap gap-2">
            <CreateProjectDialog />
            <CreateTaskDialog />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards stats={stats} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Left column - Task List (spans 2 cols on large) */}
        <div className="lg:col-span-2">
          <TaskList tasks={myTasks.length > 0 ? myTasks : tasks.slice(0, 10)} />
        </div>

        {/* Right column - Sidebar widgets */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <TaskDistributionChart tasks={tasks} />
          <UpcomingDeadlines tasks={tasks} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        <ActivityFeed activities={activities} />
        <ProjectProgress projects={projectSummaries} />
      </div>
    </div>
  );
}
