import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Activity } from "@/types/dashboard";

interface ActivityState {
  activities: Activity[];
}

const initialState: ActivityState = {
  activities: [],
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    addActivity: (
      state,
      action: PayloadAction<Omit<Activity, "id" | "timestamp">>
    ) => {
      state.activities.unshift({
        ...action.payload,
        id: nanoid(),
        timestamp: new Date().toISOString(),
      });
      // Keep only last 50
      if (state.activities.length > 50) {
        state.activities = state.activities.slice(0, 50);
      }
    },
    clearActivities: (state) => {
      state.activities = [];
    },
  },
});

export const { addActivity, clearActivities } = activitySlice.actions;
export default activitySlice.reducer;
