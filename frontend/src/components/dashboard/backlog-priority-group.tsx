import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  IconChevronDown,
  IconChevronRight,
  IconCalendar,
  IconAlertOctagon,
  IconArrowUp,
  IconMinus,
  IconArrowDown,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/dashboard/task-badges";
import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types/dashboard";

interface BacklogPriorityGroupProps {
  priority: TaskPriority;
  tasks: Task[];
}

const priorityMeta: Record<
  TaskPriority,
  {
    label: string;
    icon: typeof IconAlertOctagon;
    iconClass: string;
    borderClass: string;
    bgClass: string;
    countClass: string;
  }
> = {
  critical: {
    label: "Critical",
    icon: IconAlertOctagon,
    iconClass: "text-red-500",
    borderClass: "border-l-red-500",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    countClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  high: {
    label: "High",
    icon: IconArrowUp,
    iconClass: "text-orange-500",
    borderClass: "border-l-orange-500",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    countClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  medium: {
    label: "Medium",
    icon: IconMinus,
    iconClass: "text-yellow-500",
    borderClass: "border-l-yellow-500",
    bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
    countClass:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  low: {
    label: "Low",
    icon: IconArrowDown,
    iconClass: "text-green-500",
    borderClass: "border-l-green-500",
    bgClass: "bg-green-50 dark:bg-green-950/30",
    countClass:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function BacklogPriorityGroup({
  priority,
  tasks,
}: BacklogPriorityGroupProps) {
  const [open, setOpen] = useState(true);
  const meta = priorityMeta[priority];
  const PriorityIcon = meta.icon;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card
        className={cn(
          "border-l-4 gap-0 overflow-hidden",
          meta.borderClass
        )}
      >
        <CollapsibleTrigger asChild>
          <CardHeader
            className={cn(
              "cursor-pointer select-none px-4 py-3 transition-colors hover:bg-muted/50",
              meta.bgClass
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {open ? (
                  <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <PriorityIcon className={cn("h-4.5 w-4.5", meta.iconClass)} />
                <CardTitle className="text-sm font-semibold">
                  {meta.label} Priority
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", meta.countClass)}
                >
                  {tasks.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-0">
            {/* Table header */}
            <div className="hidden border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-12 sm:gap-3">
              <span className="col-span-1">ID</span>
              <span className="col-span-4">Title</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2">Project</span>
              <span className="col-span-1">Assignee</span>
              <span className="col-span-2 text-right">Due Date</span>
            </div>

            <div className="divide-y">
              {tasks.map((task) => (
                <BacklogRow key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function BacklogRow({ task }: { task: Task }) {
  return (
    <div className="group grid grid-cols-1 gap-2 px-4 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-12 sm:items-center sm:gap-3">
      {/* ID */}
      <span className="col-span-1 font-mono text-xs text-muted-foreground">
        {task.id}
      </span>

      {/* Title + description + tags (mobile: full row, desktop: 4 cols) */}
      <div className="col-span-4 min-w-0 space-y-1">
        <p className="truncate text-sm font-medium leading-snug">
          {task.title}
        </p>
        <p className="hidden truncate text-xs text-muted-foreground lg:block">
          {task.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="col-span-2">
        <StatusBadge status={task.status} />
      </div>

      {/* Project */}
      <div className="col-span-2">
        <span
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `${task.projectColor}15`,
            color: task.projectColor,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: task.projectColor }}
          />
          {task.project}
        </span>
      </div>

      {/* Assignee */}
      <div className="col-span-1 flex items-center">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[9px] font-medium">
            {getInitials(task.assignee.name)}
          </AvatarFallback>
        </Avatar>
        <span className="ml-1.5 truncate text-xs text-muted-foreground sm:hidden">
          {task.assignee.name}
        </span>
      </div>

      {/* Due Date */}
      <div className="col-span-2 flex items-center justify-end gap-1 text-xs text-muted-foreground sm:justify-end">
        <IconCalendar className="h-3 w-3" />
        <span>{format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
      </div>
    </div>
  );
}
