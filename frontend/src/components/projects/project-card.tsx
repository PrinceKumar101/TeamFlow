import { useProjectTasks } from "@/hooks/useProjects";
import {
  useProjectRole,
  canCreateTask,
  canAssignMembers,
} from "@/hooks/useProjectRole";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTaskForm } from "./add-task-form";
import { TaskItemRow } from "./task-item-row";
import { MemberManager } from "./member-manager";
import type { ProjectItem } from "@/types/project";
import { useAppSelector } from "@/hooks/redux";
import { Link } from "@tanstack/react-router";

interface Props {
  project: ProjectItem;
}

export function ProjectCard({ project }: Props) {
  const {
    data: tasks = [],
    isLoading: tasksLoading,
  } = useProjectTasks(project._id);

  const { projectRole, globalRole } = useProjectRole(project);
  const user = useAppSelector((s) => s.auth.user);

  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const totalCount = tasks.length;

  // Extract member user info for forms (only DEVELOPERs can be assigned)
  const developerUsers = project.members
    .filter((m) => m.role === "DEVELOPER")
    .map((m) => m.user);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/projects/$projectId"
            params={{ projectId: project._id }}
            className="hover:underline"
          >
            <CardTitle className="text-base">{project.name}</CardTitle>
          </Link>
          <Badge variant="outline" className="text-[10px]">
            {project.status}
          </Badge>
          {projectRole && (
            <Badge variant="secondary" className="text-[10px]">
              {projectRole}
            </Badge>
          )}
        </div>
        {project.description && (
          <CardDescription>{project.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Members — ADMIN / PO / PM can manage */}
        {canAssignMembers(globalRole, projectRole) ? (
          <MemberManager
            projectId={project._id}
            members={project.members}
            devOnly={globalRole !== "ADMIN"}
          />
        ) : (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Members ({project.members.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.members.map((m) => (
                <Badge
                  key={m.user._id}
                  variant="secondary"
                  className="gap-1 text-xs font-normal"
                >
                  {m.user.name}
                  <span className="ml-1 text-[9px] font-semibold opacity-60">
                    {m.role}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Task progress */}
        {totalCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {completedCount}/{totalCount} tasks done
          </p>
        )}

        {/* Task list */}
        {tasksLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItemRow
                key={task._id}
                task={task}
                projectId={project._id}
                projectRole={projectRole}
                globalRole={globalRole}
                currentUserId={user?.id ?? ""}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No tasks yet.
          </p>
        )}

        {/* Add task form — ADMIN/PO/PM */}
        {canCreateTask(projectRole, globalRole) && (
          <AddTaskForm projectId={project._id} members={developerUsers} />
        )}
      </CardContent>
    </Card>
  );
}
