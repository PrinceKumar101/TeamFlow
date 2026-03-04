import { createFileRoute, Link } from "@tanstack/react-router";
import { useProject, useProjectTasks } from "@/hooks/useProjects";
import {
  useProjectRole,
  canCreateTask,
  canAssignMembers,
} from "@/hooks/useProjectRole";
import { useAppSelector } from "@/hooks/redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Users,
  ListTodo,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { TaskItemRow } from "@/components/projects/task-item-row";
import { AddTaskForm } from "@/components/projects/add-task-form";
import { MemberManager } from "@/components/projects/member-manager";
import type { ProjectRole } from "@/types/project";

export const Route = createFileRoute("/dashboard/projects/$projectId")({
  component: ProjectDetailPage,
});

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-700 dark:text-green-400",
  COMPLETED: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  ARCHIVED: "bg-slate-500/15 text-slate-600 dark:text-slate-400",
};

const roleColor: Record<ProjectRole, string> = {
  PO: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  PM: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  DEVELOPER: "bg-green-500/15 text-green-700 dark:text-green-400",
};

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const { data: project, isLoading, isError, error } = useProject(projectId);
  const { data: tasks = [], isLoading: tasksLoading } =
    useProjectTasks(projectId);
  const user = useAppSelector((s) => s.auth.user);
  // Always call the hook — it handles undefined project gracefully
  const { projectRole, globalRole } = useProjectRole(project);

  /* ── Loading ──────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  /* ── Error / not found ────────────────────────────────────────── */
  if (isError || !project) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Link
          to="/dashboard/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to projects
        </Link>
        <Card>
          <CardContent className="flex items-center gap-3 py-8">
            <AlertCircle className="size-5 text-destructive" />
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Project not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── Derived data ─────────────────────────────────────────────── */
  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const blockedCount = tasks.filter((t) => t.status === "BLOCKED").length;
  const progress =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;

  const developerUsers = project.members
    .filter((m) => m.role === "DEVELOPER")
    .map((m) => m.user);

  // Separate parent tasks from subtasks
  const parentTasks = tasks.filter((t) => !t.parentTaskId);
  const subtasksByParent = tasks.reduce<Record<string, typeof tasks>>(
    (acc, t) => {
      if (t.parentTaskId) {
        if (!acc[t.parentTaskId]) acc[t.parentTaskId] = [];
        acc[t.parentTaskId].push(t);
      }
      return acc;
    },
    {},
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Back link */}
      <Link
        to="/dashboard/projects"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to projects
      </Link>

      {/* ── Project header ──────────────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {project.name}
          </h1>
          <Badge
            className={`border-0 text-xs font-semibold ${statusColor[project.status] ?? ""}`}
          >
            {project.status}
          </Badge>
          {projectRole && (
            <Badge
              className={`border-0 text-xs font-semibold ${roleColor[projectRole]}`}
            >
              Your role: {projectRole}
            </Badge>
          )}
          {globalRole === "ADMIN" && !projectRole && (
            <Badge variant="outline" className="text-xs font-semibold">
              ADMIN
            </Badge>
          )}
        </div>
        {project.description && (
          <p className="text-muted-foreground text-sm max-w-prose">
            {project.description}
          </p>
        )}
      </div>

      {/* ── Stats cards ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <Users className="size-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{project.members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <ListTodo className="size-5 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-4 pb-4">
            <CheckCircle2 className="size-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{progress}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
            {tasks.length > 0 && (
              <Progress value={progress} className="ml-auto h-2 w-20" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Members section ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="size-4" />
            Members ({project.members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {canAssignMembers(globalRole, projectRole) ? (
            <MemberManager
              projectId={project._id}
              members={project.members}
              devOnly={globalRole !== "ADMIN"}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {project.members.map((m) => (
                <div
                  key={m.user._id}
                  className="flex items-center gap-2 rounded-md border px-3 py-1.5"
                >
                  <Avatar className="size-6">
                    <AvatarFallback className="text-[10px] font-medium">
                      {m.user.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{m.user.name}</span>
                  <Badge
                    className={`border-0 px-1.5 py-0 text-[9px] font-semibold ${roleColor[m.role]}`}
                  >
                    {m.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Tasks section ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <ListTodo className="size-4" />
              Tasks ({tasks.length})
            </CardTitle>
            {tasks.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {completedCount} done
                {blockedCount > 0 && ` · ${blockedCount} blocked`}
              </span>
            )}
          </div>
          {projectRole === "DEVELOPER" && (
            <CardDescription className="text-xs">
              You can update the status of tasks assigned to you.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {tasksLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-2">
              {parentTasks.map((task) => (
                <TaskItemRow
                  key={task._id}
                  task={task}
                  projectId={project._id}
                  projectRole={projectRole}
                  globalRole={globalRole}
                  currentUserId={user?.id ?? ""}
                  subtasks={subtasksByParent[task._id] ?? []}
                  developerMembers={developerUsers}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No tasks yet.
            </p>
          )}

          {/* Add task — PO/PM/ADMIN */}
          {canCreateTask(projectRole, globalRole) && (
            <>
              <Separator />
              <AddTaskForm
                projectId={project._id}
                members={developerUsers}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
