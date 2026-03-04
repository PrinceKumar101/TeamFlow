import { createFileRoute, Link } from "@tanstack/react-router";
import { useProjects, useProjectTasks } from "@/hooks/useProjects";
import { CreateProjectForm } from "@/components/projects/create-project-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { FolderKanban, Users, CheckCircle2, ListTodo } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { canCreateProject } from "@/hooks/useProjectRole";
import type { ProjectItem, ProjectRole } from "@/types/project";

export const Route = createFileRoute("/dashboard/projects/")({
  component: ProjectsPage,
});

/* ── Status badge colours ─────────────────────────────────────── */
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

/* ── Small project card shown in the grid ──────────────────────── */
function ProjectListCard({ project }: { project: ProjectItem }) {
  const user = useAppSelector((s) => s.auth.user);
  const { data: tasks = [] } = useProjectTasks(project._id);
  const isAdmin = user?.role === "ADMIN";

  const membership = project.members.find((m) => m.user._id === user?.id);
  const myRole = membership?.role ?? null;

  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const progress =
    tasks.length > 0
      ? Math.round((completedCount / tasks.length) * 100)
      : 0;

  return (
    <Link
      to="/dashboard/projects/$projectId"
      params={{ projectId: project._id }}
      className="group block"
    >
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <div className="flex shrink-0 items-center gap-1.5">
              {/* Project status */}
              <Badge
                className={`border-0 px-2 py-0.5 text-[10px] font-semibold ${statusColor[project.status] ?? ""}`}
              >
                {project.status}
              </Badge>
              {/* User's role in this project */}
              {isAdmin ? (
                <Badge
                  variant="outline"
                  className="px-1.5 py-0 text-[9px] font-semibold"
                >
                  ADMIN
                </Badge>
              ) : myRole ? (
                <Badge
                  className={`border-0 px-1.5 py-0 text-[9px] font-semibold ${roleColor[myRole]}`}
                >
                  {myRole}
                </Badge>
              ) : null}
            </div>
          </div>
          {project.description && (
            <CardDescription className="line-clamp-2 text-xs">
              {project.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {project.members.length} member
              {project.members.length !== 1 && "s"}
            </span>
            <span className="flex items-center gap-1">
              <ListTodo className="size-3.5" />
              {tasks.length} task{tasks.length !== 1 && "s"}
            </span>
            {completedCount > 0 && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-green-500" />
                {completedCount} done
              </span>
            )}
          </div>

          {/* Progress bar */}
          {tasks.length > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}

          {/* Member avatars */}
          <div className="flex -space-x-2">
            {project.members.slice(0, 5).map((m) => (
              <Avatar
                key={m.user._id}
                className="size-6 border-2 border-background"
              >
                <AvatarFallback className="text-[10px] font-medium">
                  {m.user.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 5 && (
              <Avatar className="size-6 border-2 border-background">
                <AvatarFallback className="text-[9px]">
                  +{project.members.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ── Main page ─────────────────────────────────────────────────── */
function ProjectsPage() {
  const { data: projects, isLoading, isError, error } = useProjects();
  const user = useAppSelector((s) => s.auth.user);
  const globalRole = (user?.role ?? "USER") as "ADMIN" | "USER";

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FolderKanban className="size-6" />
            Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {user?.role === "ADMIN"
              ? "All projects across the organisation."
              : "Projects you are a member of."}
          </p>
        </div>
      </div>

      {/* Create project form — ADMIN only */}
      {canCreateProject(globalRole) && <CreateProjectForm />}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-sm text-destructive">
          Failed to load projects:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {/* Empty state */}
      {projects && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FolderKanban className="size-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-sm">
            {user?.role === "ADMIN"
              ? "No projects yet. Create one above to get started!"
              : "You aren't a member of any projects yet."}
          </p>
        </div>
      )}

      {/* Project grid */}
      {projects && projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectListCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
