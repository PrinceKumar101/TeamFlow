import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  IconLayoutList,
  IconSearch,
  IconFilter,
  IconChecklist,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BacklogPriorityGroup } from "@/components/dashboard/backlog-priority-group";
import { BacklogCreateTaskDialog } from "@/components/dashboard/dialogs/backlog-create-task-dialog";
import type { TaskPriority } from "@/types/project";
import { useAllTasks } from "@/hooks/useAllTasks";

export const Route = createFileRoute("/dashboard/backlog")({
  component: BacklogPage,
});

const priorityOrder: TaskPriority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function BacklogPage() {
  const { tasks, projects, isLoading } = useAllTasks();
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        search === "" ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesProject =
        projectFilter === "all" || task.projectId === projectFilter;
      return matchesSearch && matchesProject;
    });
  }, [tasks, search, projectFilter]);

  // Group by priority
  const groupedByPriority = useMemo(() => {
    const groups: Record<TaskPriority, typeof filteredTasks> = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: [],
    };
    filteredTasks.forEach((task) => {
      groups[task.priority].push(task);
    });
    return groups;
  }, [filteredTasks]);

  const totalCount = filteredTasks.length;

  /* ── Loading state ───────────────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-2">
            <IconLayoutList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
              Backlog
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              All tasks organized by priority
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────────────────────── */
  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2">
              <IconLayoutList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
                Backlog
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                All tasks organized by priority
              </p>
            </div>
          </div>
          <BacklogCreateTaskDialog projects={projects} />
        </div>
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <IconLayoutList className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            Backlog is empty
          </p>
          <p className="text-xs text-muted-foreground max-w-xs">
            {projects.length === 0
              ? "Create a project first, then add tasks to your backlog."
              : "Add tasks to a project to start building your backlog."}
          </p>
        </div>
      </div>
    );
  }

  /* ── Main view ───────────────────────────────────────────────── */
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2">
              <IconLayoutList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
                Backlog
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                All tasks organized by priority
              </p>
            </div>
          </div>
          <BacklogCreateTaskDialog projects={projects} />
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative max-w-xs flex-1">
            <IconSearch className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-sm"
            />
          </div>

          {/* Project filter */}
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-45">
              <div className="flex items-center gap-1.5">
                <IconFilter className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="All Projects" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconChecklist className="h-4 w-4" />
          <span>
            <span className="font-semibold text-foreground">{totalCount}</span>{" "}
            tasks
          </span>
          {search || projectFilter !== "all" ? (
            <Badge
              variant="secondary"
              className="ml-1 cursor-pointer text-xs"
              onClick={() => {
                setSearch("");
                setProjectFilter("all");
              }}
            >
              Clear filters
            </Badge>
          ) : null}
        </div>
      </div>

      <Separator />

      {/* Priority groups */}
      <div className="flex flex-col gap-4">
        {priorityOrder.map((priority) => {
          const priorityTasks = groupedByPriority[priority];
          if (priorityTasks.length === 0) return null;
          return (
            <BacklogPriorityGroup
              key={priority}
              priority={priority}
              tasks={priorityTasks}
            />
          );
        })}

        {totalCount === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
            <IconLayoutList className="h-10 w-10" />
            <p className="text-sm font-medium">No tasks found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
