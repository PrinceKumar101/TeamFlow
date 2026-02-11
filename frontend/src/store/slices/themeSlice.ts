import { createSlice} from "@reduxjs/toolkit";

type ThemeState = {
  value: boolean;
};

const initialState: ThemeState = {
  value: document.documentElement.classList.contains("dark"),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.value) {
        state.value = !state.value;
        localStorage.setItem("darkMode", "false");
        document.documentElement.classList.remove("dark");
      } else {
        state.value = !state.value;
        localStorage.setItem("darkMode", "true");
        document.documentElement.classList.add("dark");

      }
    },
  },
});
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
