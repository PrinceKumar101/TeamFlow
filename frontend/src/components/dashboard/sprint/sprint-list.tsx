import { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  addTaskToSprint,
  removeTaskFromSprint,
  updateSprintStatus,
  deleteSprint,
} from "@/store/slices/sprintsSlice";
import { addActivity } from "@/store/slices/activitySlice";
import { useProjectMap } from "@/hooks/useProjectMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  IconChevronDown,
  IconChevronRight,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { format, parseISO } from "date-fns";
import { StatusBadge, PriorityBadge } from "../task-badges";
import type { Sprint, SprintStatus, Task, Project } from "@/types/dashboard";

export function SprintList() {
  const sprints = useAppSelector((state) => state.sprints.sprints);
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const projectMap = useProjectMap();

  const unassignedTasks = useMemo(() => {
    const assignedIds = new Set(sprints.flatMap((s) => s.taskIds));
    return tasks.filter((t) => !assignedIds.has(t.id) && t.status !== "done");
  }, [tasks, sprints]);

  if (sprints.length === 0) return null;

  return (
    <div className="space-y-4">
      {sprints.map((sprint) => (
        <SprintCard
          key={sprint.id}
          sprint={sprint}
          tasks={tasks}
          projectMap={projectMap}
          unassignedTasks={unassignedTasks}
        />
      ))}
    </div>
  );
}

function SprintCard({
  sprint,
  tasks,
  projectMap,
  unassignedTasks,
}: {
  sprint: Sprint;
  tasks: Task[];
  projectMap: Map<string, Project>;
  unassignedTasks: Task[];
}) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(true);
  const [addingTask, setAddingTask] = useState(false);

  const sprintTasks = useMemo(() => {
    return sprint.taskIds
      .map((id) => tasks.find((t) => t.id === id))
      .filter(Boolean) as Task[];
  }, [sprint.taskIds, tasks]);

  const completedCount = sprintTasks.filter(
    (t) => t.status === "done"
  ).length;
  const percentage =
    sprintTasks.length > 0
      ? Math.round((completedCount / sprintTasks.length) * 100)
      : 0;

  const statusColors: Record<SprintStatus, string> = {
    planning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    active: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  };

  const handleAddTask = (taskId: string) => {
    dispatch(addTaskToSprint({ sprintId: sprint.id, taskId }));
    const task = tasks.find((t) => t.id === taskId);
    dispatch(
      addActivity({
        user: "You",
        action: "added task to sprint",
        target: task?.title || "",
        project: sprint.name,
      })
    );
    setAddingTask(false);
  };

  const handleRemoveTask = (taskId: string) => {
    dispatch(removeTaskFromSprint({ sprintId: sprint.id, taskId }));
  };

  const handleStatusChange = (status: SprintStatus) => {
    dispatch(updateSprintStatus({ id: sprint.id, status }));
  };

  const handleDelete = () => {
    dispatch(deleteSprint(sprint.id));
    dispatch(
      addActivity({
        user: "You",
        action: "deleted sprint",
        target: sprint.name,
        project: "",
      })
    );
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="gap-0 overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer px-4 py-3 hover:bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {open ? (
                  <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <CardTitle className="text-sm font-semibold">
                  {sprint.name}
                </CardTitle>
                <Badge className={statusColors[sprint.status]}>
                  {sprint.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(parseISO(sprint.startDate), "MMM d")} –{" "}
                  {format(parseISO(sprint.endDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={sprint.status}
                  onValueChange={(v) =>
                    handleStatusChange(v as SprintStatus)
                  }
                >
                  <SelectTrigger
                    className="h-7 w-28 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            {sprint.goal && (
              <CardDescription className="ml-7 text-xs">
                {sprint.goal}
              </CardDescription>
            )}
            <div className="ml-7 mt-2 space-y-1">
              <Progress value={percentage} className="h-1.5" />
              <p className="text-xs text-muted-foreground">
                {completedCount}/{sprintTasks.length} tasks completed (
                {percentage}%)
              </p>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">
            <div className="divide-y">
              {sprintTasks.map((task) => {
                const project = projectMap.get(task.projectId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-muted/30"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {task.id}
                      </span>
                      <span className="truncate text-sm">{task.title}</span>
                      {project && (
                        <span
                          className="shrink-0 rounded px-1.5 py-0.5 text-xs"
                          style={{
                            backgroundColor: `${project.color}15`,
                            color: project.color,
                          }}
                        >
                          {project.name}
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <IconTrash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {sprintTasks.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No tasks in this sprint yet
                </div>
              )}
            </div>
            <div className="border-t px-4 py-2.5">
              {addingTask ? (
                <div className="flex items-center gap-2">
                  <Select onValueChange={handleAddTask}>
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue placeholder="Select a task to add..." />
                    </SelectTrigger>
                    <SelectContent>
                      {unassignedTasks.length === 0 ? (
                        <SelectItem value="__none" disabled>
                          No unassigned tasks
                        </SelectItem>
                      ) : (
                        unassignedTasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.id} – {task.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingTask(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setAddingTask(true)}
                >
                  <IconPlus className="mr-1 h-3.5 w-3.5" />
                  Add Task
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
