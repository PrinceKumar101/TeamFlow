import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateTask, deleteTask } from "@/store/slices/tasksSlice";
import { addActivity } from "@/store/slices/activitySlice";
import type { Task, TaskPriority, TaskStatus } from "@/types/dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconTrash } from "@tabler/icons-react";
import { SubtaskList } from "../subtask-list";
import { Separator } from "@/components/ui/separator";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: EditTaskDialogProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);
  // Read the live task from the store so subtask changes are reflected immediately
  const liveTask = useAppSelector((state) =>
    state.tasks.tasks.find((t) => t.id === task?.id)
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [projectId, setProjectId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setProjectId(task.projectId);
      setAssignee(task.assignee);
      setDueDate(task.dueDate);
      setTagsInput(task.tags.join(", "));
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !title.trim() || !projectId) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const project = projects.find((p) => p.id === projectId);

    dispatch(
      updateTask({
        id: task.id,
        updates: {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          projectId,
          assignee: assignee.trim() || "Unassigned",
          dueDate,
          tags,
        },
      })
    );

    dispatch(
      addActivity({
        user: "You",
        action: "updated task",
        target: title.trim(),
        project: project?.name || "",
      })
    );

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!task) return;
    const project = projects.find((p) => p.id === task.projectId);
    dispatch(deleteTask(task.id));
    dispatch(
      addActivity({
        user: "You",
        action: "deleted task",
        target: task.title,
        project: project?.name || "",
      })
    );
    onOpenChange(false);
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription className="font-mono text-xs">
                {task.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assignee">Assignee</Label>
              <Input
                id="edit-assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-due">Due Date</Label>
              <Input
                id="edit-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {/* ── Subtasks section ── */}
          <Separator />
          <SubtaskList
            taskId={task.id}
            subtasks={liveTask?.subtasks ?? task.subtasks ?? []}
          />
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <IconTrash className="mr-1 h-4 w-4" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim() || !projectId}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
