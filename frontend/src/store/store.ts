import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/counter";
import themeSlice from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    counter: counterSlice,
    theme: themeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
