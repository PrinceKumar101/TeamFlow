import { useState } from "react";
import { useUpdateTaskStatus, useDeleteTask } from "@/hooks/useProjects";
import {
  canDeleteTask,
  canUpdateAnyTask,
  canUpdateAssignedTask,
  canCreateTask,
} from "@/hooks/useProjectRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, User, ChevronRight, ChevronDown } from "lucide-react";
import { AddSubtaskForm } from "@/components/projects/add-subtask-form";
import type {
  TaskItem as TaskItemType,
  TaskStatus,
  ProjectRole,
  UserInfo,
} from "@/types/project";

const priorityColors: Record<string, string> = {
  LOW: "text-slate-500",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
};

interface Props {
  task: TaskItemType;
  projectId: string;
  projectRole: ProjectRole | null;
  globalRole: string | null;
  currentUserId: string;
  subtasks?: TaskItemType[];
  developerMembers?: UserInfo[];
}

export function TaskItemRow({
  task,
  projectId,
  projectRole,
  globalRole,
  currentUserId,
  subtasks = [],
  developerMembers = [],
}: Props) {
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const [expanded, setExpanded] = useState(false);

  const isAssignedToMe = task.assignedTo?._id === currentUserId;
  const isParentTask = !task.parentTaskId;
  const hasSubtasks = subtasks.length > 0;

  // ADMIN/PO/PM can update any task; DEVELOPER can only update assigned tasks
  const canChangeStatus =
    canUpdateAnyTask(projectRole, globalRole) ||
    (isAssignedToMe &&
      canUpdateAssignedTask(
        projectRole,
        task.assignedTo?._id ?? "",
        currentUserId,
        globalRole,
      ));

  const canDelete = canDeleteTask(projectRole, globalRole);
  const canAddSubtask =
    isParentTask && canCreateTask(projectRole, globalRole);

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateStatus.mutate({ projectId, taskId: task._id, status: newStatus });
  };

  const completedSubtasks = subtasks.filter((s) => s.status === "DONE").length;

  return (
    <div>
      <div className="flex items-center gap-3 rounded-md border px-3 py-2">
        {/* Expand / collapse toggle for parent tasks with subtasks */}
        {isParentTask && hasSubtasks ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </Button>
        ) : isParentTask ? (
          <span className="w-6 shrink-0" />
        ) : null}

        {/* Status selector — enabled only if user has permission */}
        {canChangeStatus ? (
          <Select
            value={task.status}
            onValueChange={(v) => handleStatusChange(v as TaskStatus)}
            disabled={updateStatus.isPending}
          >
            <SelectTrigger className="h-7 w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline" className="h-7 text-xs">
            {task.status.replace("_", " ")}
          </Badge>
        )}

        {/* Title */}
        <span
          className={`flex-1 text-sm ${task.status === "DONE" ? "text-muted-foreground line-through" : ""}`}
        >
          {task.title}
        </span>

        {/* Subtask count badge for parent tasks */}
        {isParentTask && hasSubtasks && (
          <Badge variant="secondary" className="text-[10px] font-medium gap-1">
            {completedSubtasks}/{subtasks.length} subtasks
          </Badge>
        )}

        {/* Priority badge */}
        <Badge
          variant="outline"
          className={`text-[10px] font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </Badge>

        {/* Assignee */}
        {task.assignedTo && (
          <Badge variant="outline" className="gap-1 text-xs font-normal">
            <User className="size-3" />
            {task.assignedTo.name}
          </Badge>
        )}

        {/* Add subtask button — only for parent tasks, ADMIN/PO/PM */}
        {canAddSubtask && (
          <AddSubtaskForm
            projectId={projectId}
            parentTaskId={task._id}
            members={developerMembers}
          />
        )}

        {/* Delete button — only PO/PM */}
        {canDelete && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => deleteTask.mutate({ projectId, taskId: task._id })}
            disabled={deleteTask.isPending}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        )}
      </div>

      {/* Subtasks — shown when expanded */}
      {isParentTask && hasSubtasks && expanded && (
        <div className="ml-8 mt-1 space-y-1 border-l-2 border-muted pl-3">
          {subtasks.map((sub) => (
            <TaskItemRow
              key={sub._id}
              task={sub}
              projectId={projectId}
              projectRole={projectRole}
              globalRole={globalRole}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
