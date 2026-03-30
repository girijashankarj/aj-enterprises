import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode } from "../../types";

/** Default is light; dark is opt-in via toggle (persisted in localStorage). */
const stored = localStorage.getItem("ak-theme") as ThemeMode | null;
const initialMode: ThemeMode = stored === "light" || stored === "dark" ? stored : "light";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: initialMode },
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem("ak-theme", action.payload);
    },
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("ak-theme", state.mode);
    }
  }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
