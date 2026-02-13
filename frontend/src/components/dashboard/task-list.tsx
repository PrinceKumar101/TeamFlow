import { format, isAfter, parseISO } from "date-fns";
import { IconCalendar, IconGripVertical } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge, StatusBadge } from "./task-badges";
import type { Task } from "@/types/dashboard";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const today = new Date();

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">My Tasks</CardTitle>
            <CardDescription className="text-xs">
              {tasks.length} tasks assigned to you
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[420px]">
          <div className="divide-y">
            {tasks.map((task) => {
              const dueDate = parseISO(task.dueDate);
              const isOverdue =
                isAfter(today, dueDate) && task.status !== "done";

              return (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-1 hidden cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                    <IconGripVertical className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="shrink-0 text-xs font-mono text-muted-foreground">
                        {task.id}
                      </span>
                      <span className="truncate text-sm font-medium">
                        {task.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                      <span
                        className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${task.projectColor}15`,
                          color: task.projectColor,
                        }}
                      >
                        {task.project}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IconCalendar className="h-3 w-3" />
                      <span className={isOverdue ? "font-medium text-red-500" : ""}>
                        {isOverdue ? "Overdue · " : ""}
                        {format(dueDate, "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
