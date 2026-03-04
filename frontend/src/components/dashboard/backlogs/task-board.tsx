import { useMemo, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateTaskStatus, deleteTask } from "@/store/slices/tasksSlice";
import { addActivity } from "@/store/slices/activitySlice";
import { useProjectMap } from "@/hooks/useProjectMap";
import { TaskCard } from "./task-card";
import { EditTaskDialog } from "../dialogs/edit-task-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskStatus } from "@/types/dashboard";

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: "todo", label: "To Do", color: "bg-slate-500" },
  { status: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { status: "in-review", label: "In Review", color: "bg-purple-500" },
  { status: "done", label: "Done", color: "bg-emerald-500" },
];

export function TaskBoard() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const projectMap = useProjectMap();
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      "in-progress": [],
      "in-review": [],
      done: [],
    };
    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks]);

  const handleDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const project = projectMap.get(task.projectId);
      dispatch(deleteTask(taskId));
      dispatch(
        addActivity({
          user: "You",
          action: "deleted task",
          target: task.title,
          project: project?.name || "",
        })
      );
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setEditOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <div
            key={col.status}
            className="flex flex-col rounded-lg border bg-muted/30"
          >
            <div className="flex items-center gap-2 border-b px-3 py-2.5">
              <div className={`h-2 w-2 rounded-full ${col.color}`} />
              <span className="text-sm font-semibold">{col.label}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {tasksByStatus[col.status].length}
              </Badge>
            </div>
            <ScrollArea className="flex-1">
              <div
                className="flex flex-col gap-2 p-2"
                style={{ minHeight: "200px" }}
              >
                {tasksByStatus[col.status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projectMap.get(task.projectId)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
                {tasksByStatus[col.status].length === 0 && (
                  <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
      <EditTaskDialog
        task={editTask}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
