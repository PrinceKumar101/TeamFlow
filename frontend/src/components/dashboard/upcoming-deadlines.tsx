import { format, parseISO, isAfter, differenceInDays } from "date-fns";
import { IconClock, IconAlertCircle } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "./task-badges";
import type { Task } from "@/types/dashboard";

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const today = new Date();

  const upcoming = tasks
    .filter((t) => t.status !== "done")
    .sort(
      (a, b) =>
        parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()
    )
    .slice(0, 5);

  return (
    <Card className="flex flex-col gap-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Upcoming Deadlines
        </CardTitle>
        <CardDescription className="text-xs">
          Tasks due soon that need your attention
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          <div className="divide-y">
            {upcoming.map((task) => {
              const dueDate = parseISO(task.dueDate);
              const isOverdue = isAfter(today, dueDate);
              const daysLeft = differenceInDays(dueDate, today);

              let urgencyText: string;
              let urgencyClass: string;

              if (isOverdue) {
                urgencyText = "Overdue";
                urgencyClass = "text-red-500 font-medium";
              } else if (daysLeft <= 1) {
                urgencyText = "Due today";
                urgencyClass = "text-orange-500 font-medium";
              } else if (daysLeft <= 3) {
                urgencyText = `${daysLeft}d left`;
                urgencyClass = "text-yellow-600 dark:text-yellow-400 font-medium";
              } else {
                urgencyText = `${daysLeft}d left`;
                urgencyClass = "text-muted-foreground";
              }

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    {isOverdue ? (
                      <IconAlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    ) : (
                      <IconClock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(dueDate, "MMM d")}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <span className={`text-xs ${urgencyClass}`}>
                      {urgencyText}
                    </span>
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No upcoming deadlines. You're all caught up!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
