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
import { BacklogPriorityGroup } from "@/components/dashboard/backlog-priority-group";
import { backlogTasks } from "@/data/dashboard-data";
import type { TaskPriority } from "@/types/dashboard";

export const Route = createFileRoute("/dashboard/backlog")({
  component: BacklogPage,
});

const priorityOrder: TaskPriority[] = ["critical", "high", "medium", "low"];

function BacklogPage() {
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");

  // Unique projects for filter
  const projects = useMemo(() => {
    const set = new Set(backlogTasks.map((t) => t.project));
    return Array.from(set).sort();
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return backlogTasks.filter((task) => {
      const matchesSearch =
        search === "" ||
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.id.toLowerCase().includes(search.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchesProject =
        projectFilter === "all" || task.project === projectFilter;
      return matchesSearch && matchesProject;
    });
  }, [search, projectFilter]);

  // Group by priority
  const groupedByPriority = useMemo(() => {
    const groups: Record<TaskPriority, typeof filteredTasks> = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };
    filteredTasks.forEach((task) => {
      groups[task.priority].push(task);
    });
    return groups;
  }, [filteredTasks]);

  const totalCount = filteredTasks.length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-1">
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
                <SelectItem key={project} value={project}>
                  {project}
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
          const tasks = groupedByPriority[priority];
          if (tasks.length === 0) return null;
          return (
            <BacklogPriorityGroup
              key={priority}
              priority={priority}
              tasks={tasks}
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
