import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { IconTestPipe, IconCheck, IconArrowBack } from "@tabler/icons-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { useProjectMap } from "@/hooks/useProjectMap";
import { updateTaskStatus } from "@/store/slices/tasksSlice";
import { addActivity } from "@/store/slices/activitySlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "@/components/dashboard/task-badges";
import { EmptyState } from "@/components/dashboard/empty-state";
import { format, parseISO } from "date-fns";

export const Route = createFileRoute("/dashboard/testing")({
  component: TestingPage,
});

function TestingPage() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const projectMap = useProjectMap();

  const reviewTasks = useMemo(
    () => tasks.filter((t) => t.status === "in-review"),
    [tasks]
  );

  const handleApprove = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    dispatch(updateTaskStatus({ id: taskId, status: "done" }));
    const project = projectMap.get(task.projectId);
    dispatch(
      addActivity({
        user: "You",
        action: "approved and completed",
        target: task.title,
        project: project?.name || "",
      })
    );
  };

  const handleReject = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    dispatch(updateTaskStatus({ id: taskId, status: "in-progress" }));
    const project = projectMap.get(task.projectId);
    dispatch(
      addActivity({
        user: "You",
        action: "sent back to progress",
        target: task.title,
        project: project?.name || "",
      })
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconTestPipe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
              Testing & Review
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Review tasks and approve or send them back
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {reviewTasks.length} in review
        </Badge>
      </div>

      <Separator />

      {reviewTasks.length === 0 ? (
        <EmptyState
          icon={IconTestPipe}
          title="No tasks in review"
          description="Tasks moved to 'In Review' status will appear here for testing and approval."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviewTasks.map((task) => {
            const project = projectMap.get(task.projectId);
            return (
              <Card key={task.id} className="gap-0">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      {task.id}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold leading-snug">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
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
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="px-1.5 py-0 text-[10px]"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Assigned to {task.assignee}</span>
                    <span>Due {format(parseISO(task.dueDate), "MMM d")}</span>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleReject(task.id)}
                    >
                      <IconArrowBack className="mr-1 h-4 w-4" />
                      Send Back
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(task.id)}
                    >
                      <IconCheck className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
