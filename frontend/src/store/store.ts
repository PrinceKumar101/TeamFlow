import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import tasksSlice from "./slices/tasksSlice";
import projectsSlice from "./slices/projectsSlice";
import sprintsSlice from "./slices/sprintsSlice";
import activitySlice from "./slices/activitySlice";
import todoSlice from "./slices/todoSlice";
import authSlice from "./slices/authSlice";

const store = configureStore({
  reducer: {
    theme: themeSlice,
    tasks: tasksSlice,
    projects: projectsSlice,
    sprints: sprintsSlice,
    activity: activitySlice,
    todo: todoSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
