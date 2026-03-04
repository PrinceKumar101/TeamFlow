import { format, parseISO, isAfter } from "date-fns";
import { IconCalendar, IconTrash } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriorityBadge } from "../task-badges";
import { SubtaskProgress } from "../subtask-list";
import type { Task, Project } from "@/types/dashboard";

interface TaskCardProps {
  task: Task;
  project?: Project;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, project, onDelete, onEdit }: TaskCardProps) {
  const today = new Date();
  const dueDate = parseISO(task.dueDate);
  const isOverdue = isAfter(today, dueDate) && task.status !== "done";

  return (
    <Card
      className="group cursor-pointer gap-0 py-3 transition-shadow hover:shadow-md"
      onClick={() => onEdit(task)}
    >
      <CardContent className="space-y-2 px-3 pb-0">
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {task.id}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <IconTrash className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          <SubtaskProgress subtasks={task.subtasks ?? []} />
          {project && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${project.color}15`,
                color: project.color,
              }}
            >
              {project.name}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconCalendar className="h-3 w-3" />
            <span className={isOverdue ? "font-medium text-red-500" : ""}>
              {format(dueDate, "MMM d")}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
      </CardContent>
    </Card>
  );
}
