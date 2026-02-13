import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TaskList } from "@/components/dashboard/task-list";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ProjectProgress } from "@/components/dashboard/project-progress";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { TaskDistributionChart } from "@/components/dashboard/task-distribution-chart";
import {
  dashboardStats,
  myTasks,
  recentActivity,
  projectSummaries,
} from "@/data/dashboard-data";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <DashboardHeader userName="John Doe" />

      {/* Stats Overview */}
      <StatsCards stats={dashboardStats} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Left column - Task List (spans 2 cols on large) */}
        <div className="lg:col-span-2">
          <TaskList tasks={myTasks} />
        </div>

        {/* Right column - Sidebar widgets */}
        <div className="flex flex-col gap-4 lg:gap-6">
          <TaskDistributionChart tasks={myTasks} />
          <UpcomingDeadlines tasks={myTasks} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        <ActivityFeed activities={recentActivity} />
        <ProjectProgress projects={projectSummaries} />
      </div>
    </div>
  );
}
