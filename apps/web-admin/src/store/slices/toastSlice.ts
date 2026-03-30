import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ToastItem = {
  id: string;
  message: string;
  tone: "success" | "error" | "info";
};

type ToastState = { items: ToastItem[] };

const initialState: ToastState = { items: [] };

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    pushToast(state, action: PayloadAction<Omit<ToastItem, "id"> & { id?: string }>) {
      const id = action.payload.id ?? crypto.randomUUID();
      state.items.push({
        id,
        message: action.payload.message,
        tone: action.payload.tone
      });
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    }
  }
});

export const { pushToast, dismissToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
