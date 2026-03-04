import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/types/dashboard";

interface ProjectsState {
  projects: Project[];
}

const initialState: ProjectsState = {
  projects: [],
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: (
      state,
      action: PayloadAction<Omit<Project, "id" | "createdAt">>
    ) => {
      state.projects.push({
        ...action.payload,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      });
    },
    updateProject: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Omit<Project, "id">> }>
    ) => {
      const idx = state.projects.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.projects[idx] = {
          ...state.projects[idx],
          ...action.payload.updates,
        };
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } =
  projectsSlice.actions;
export default projectsSlice.reducer;
