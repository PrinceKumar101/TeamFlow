import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskStatus } from "@/types/dashboard";

interface TasksState {
  tasks: Task[];
  nextId: number;
}

const initialState: TasksState = {
  tasks: [],
  nextId: 1001,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt" | "subtasks"> & { subtasks?: Task["subtasks"] }>
    ) => {
      const id = `TASK-${state.nextId}`;
      state.nextId++;
      const now = new Date().toISOString();
      state.tasks.push({
        ...action.payload,
        id,
        subtasks: action.payload.subtasks ?? [],
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTask: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Omit<Task, "id" | "createdAt">>;
      }>
    ) => {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = {
          ...state.tasks[idx],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = new Date().toISOString();
      }
    },

    // ── Subtask actions ──────────────────────────────────────────────
    addSubtask: (
      state,
      action: PayloadAction<{ taskId: string; title: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks.push({
          id: nanoid(),
          title: action.payload.title,
          completed: false,
        });
        task.updatedAt = new Date().toISOString();
      }
    },
    toggleSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        const sub = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (sub) {
          sub.completed = !sub.completed;
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    updateSubtask: (
      state,
      action: PayloadAction<{
        taskId: string;
        subtaskId: string;
        title: string;
      }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        const sub = task.subtasks.find((s) => s.id === action.payload.subtaskId);
        if (sub) {
          sub.title = action.payload.title;
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    deleteSubtask: (
      state,
      action: PayloadAction<{ taskId: string; subtaskId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.subtasks = task.subtasks.filter(
          (s) => s.id !== action.payload.subtaskId
        );
        task.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  addSubtask,
  toggleSubtask,
  updateSubtask,
  deleteSubtask,
} = tasksSlice.actions;
export default tasksSlice.reducer;
