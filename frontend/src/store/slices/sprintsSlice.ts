import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Sprint, SprintStatus } from "@/types/dashboard";

interface SprintsState {
  sprints: Sprint[];
}

const initialState: SprintsState = {
  sprints: [],
};

const sprintsSlice = createSlice({
  name: "sprints",
  initialState,
  reducers: {
    addSprint: (
      state,
      action: PayloadAction<Omit<Sprint, "id" | "createdAt" | "taskIds">>
    ) => {
      state.sprints.push({
        ...action.payload,
        id: nanoid(),
        taskIds: [],
        createdAt: new Date().toISOString(),
      });
    },
    updateSprint: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Omit<Sprint, "id">> }>
    ) => {
      const idx = state.sprints.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.sprints[idx] = {
          ...state.sprints[idx],
          ...action.payload.updates,
        };
      }
    },
    deleteSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter((s) => s.id !== action.payload);
    },
    addTaskToSprint: (
      state,
      action: PayloadAction<{ sprintId: string; taskId: string }>
    ) => {
      const sprint = state.sprints.find(
        (s) => s.id === action.payload.sprintId
      );
      if (sprint && !sprint.taskIds.includes(action.payload.taskId)) {
        sprint.taskIds.push(action.payload.taskId);
      }
    },
    removeTaskFromSprint: (
      state,
      action: PayloadAction<{ sprintId: string; taskId: string }>
    ) => {
      const sprint = state.sprints.find(
        (s) => s.id === action.payload.sprintId
      );
      if (sprint) {
        sprint.taskIds = sprint.taskIds.filter(
          (id) => id !== action.payload.taskId
        );
      }
    },
    updateSprintStatus: (
      state,
      action: PayloadAction<{ id: string; status: SprintStatus }>
    ) => {
      const sprint = state.sprints.find((s) => s.id === action.payload.id);
      if (sprint) {
        sprint.status = action.payload.status;
      }
    },
  },
});

export const {
  addSprint,
  updateSprint,
  deleteSprint,
  addTaskToSprint,
  removeTaskFromSprint,
  updateSprintStatus,
} = sprintsSlice.actions;
export default sprintsSlice.reducer;
