import { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import {
  addSubtask,
  toggleSubtask,
  updateSubtask,
  deleteSubtask,
} from "@/store/slices/tasksSlice";
import type { SubTask } from "@/types/dashboard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  IconPlus,
  IconTrash,
  IconPencil,
  IconCheck,
  IconX,
  IconSubtask,
} from "@tabler/icons-react";

interface SubtaskListProps {
  taskId: string;
  subtasks: SubTask[];
}

export function SubtaskList({ taskId, subtasks }: SubtaskListProps) {
  const dispatch = useAppDispatch();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0;

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    dispatch(addSubtask({ taskId, title: trimmed }));
    setNewTitle("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleToggle = (subtaskId: string) => {
    dispatch(toggleSubtask({ taskId, subtaskId }));
  };

  const startEdit = (sub: SubTask) => {
    setEditingId(sub.id);
    setEditingTitle(sub.title);
  };

  const saveEdit = () => {
    if (editingId && editingTitle.trim()) {
      dispatch(
        updateSubtask({ taskId, subtaskId: editingId, title: editingTitle.trim() })
      );
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  const handleDelete = (subtaskId: string) => {
    dispatch(deleteSubtask({ taskId, subtaskId }));
  };

  return (
    <div className="space-y-3">
      {/* Header with progress */}
      <div className="flex items-center gap-2">
        <IconSubtask className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Subtasks</span>
        {subtasks.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {completedCount}/{subtasks.length}
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <Progress value={progress} className="h-1.5" />
      )}

      {/* Subtask items */}
      <div className="space-y-1">
        {subtasks.map((sub) => (
          <div
            key={sub.id}
            className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
          >
            <Checkbox
              checked={sub.completed}
              onCheckedChange={() => handleToggle(sub.id)}
              className="h-4 w-4"
            />

            {editingId === sub.id ? (
              <div className="flex flex-1 items-center gap-1">
                <Input
                  ref={editInputRef}
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="h-7 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={saveEdit}
                >
                  <IconCheck className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={cancelEdit}
                >
                  <IconX className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 text-sm ${
                    sub.completed
                      ? "text-muted-foreground line-through"
                      : ""
                  }`}
                >
                  {sub.title}
                </span>
                <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => startEdit(sub)}
                  >
                    <IconPencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(sub.id)}
                  >
                    <IconTrash className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add new subtask */}
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a subtask..."
          className="h-8 text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleAdd}
          disabled={!newTitle.trim()}
        >
          <IconPlus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/** Compact badge showing subtask progress — use on cards / list rows */
export function SubtaskProgress({ subtasks }: { subtasks: SubTask[] }) {
  if (subtasks.length === 0) return null;

  const done = subtasks.filter((s) => s.completed).length;
  const allDone = done === subtasks.length;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${
        allDone
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <IconSubtask className="h-3 w-3" />
      {done}/{subtasks.length}
    </span>
  );
}
