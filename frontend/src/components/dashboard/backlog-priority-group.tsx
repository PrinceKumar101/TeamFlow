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
import { cn } from "@/lib/utils";
import type { TaskWithProject } from "@/hooks/useAllTasks";
import type { TaskPriority, TaskStatus } from "@/types/project";

interface BacklogPriorityGroupProps {
  priority: TaskPriority;
  tasks: TaskWithProject[];
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
  CRITICAL: {
    label: "Critical",
    icon: IconAlertOctagon,
    iconClass: "text-red-500",
    borderClass: "border-l-red-500",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    countClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  HIGH: {
    label: "High",
    icon: IconArrowUp,
    iconClass: "text-orange-500",
    borderClass: "border-l-orange-500",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    countClass:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  MEDIUM: {
    label: "Medium",
    icon: IconMinus,
    iconClass: "text-yellow-500",
    borderClass: "border-l-yellow-500",
    bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
    countClass:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  LOW: {
    label: "Low",
    icon: IconArrowDown,
    iconClass: "text-green-500",
    borderClass: "border-l-green-500",
    bgClass: "bg-green-50 dark:bg-green-950/30",
    countClass:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

const statusStyles: Record<TaskStatus, { label: string; className: string }> = {
  TODO: {
    label: "To Do",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  DONE: {
    label: "Done",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  BLOCKED: {
    label: "Blocked",
    className:
      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800",
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
              <span className="col-span-4">Title</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-3">Project</span>
              <span className="col-span-1">Assignee</span>
              <span className="col-span-2 text-right">Due Date</span>
            </div>

            <div className="divide-y">
              {tasks.map((task) => (
                <BacklogRow
                  key={task._id}
                  task={task}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function BacklogRow({ task }: { task: TaskWithProject }) {
  const status = statusStyles[task.status];

  return (
    <div className="group grid grid-cols-1 gap-2 px-4 py-3 transition-colors hover:bg-muted/40 sm:grid-cols-12 sm:items-center sm:gap-3">
      {/* Title + description */}
      <div className="col-span-4 min-w-0 space-y-0.5">
        <p className="truncate text-sm font-medium leading-snug">
          {task.title}
        </p>
        {task.description && (
          <p className="hidden truncate text-xs text-muted-foreground lg:block">
            {task.description}
          </p>
        )}
      </div>

      {/* Status */}
      <div className="col-span-2">
        <Badge
          variant="outline"
          className={cn("text-xs font-medium", status.className)}
        >
          {status.label}
        </Badge>
      </div>

      {/* Project */}
      <div className="col-span-3">
        <Badge variant="secondary" className="text-xs font-medium">
          {task.projectName}
        </Badge>
      </div>

      {/* Assignee */}
      <div className="col-span-1 flex items-center">
        {task.assignedTo && (
          <>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[9px] font-medium">
                {getInitials(task.assignedTo.name)}
              </AvatarFallback>
            </Avatar>
            <span className="ml-1.5 truncate text-xs text-muted-foreground sm:hidden">
              {task.assignedTo.name}
            </span>
          </>
        )}
      </div>

      {/* Due Date */}
      <div className="col-span-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        {task.dueDate ? (
          <>
            <IconCalendar className="h-3 w-3" />
            <span>{format(parseISO(task.dueDate), "MMM d, yyyy")}</span>
          </>
        ) : (
          <span className="italic">No date</span>
        )}
      </div>
    </div>
  );
}
