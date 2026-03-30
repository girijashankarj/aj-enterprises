import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types";

type TasksState = { items: Task[] };

const initialState: TasksState = {
  items: [
    {
      id: "task-1",
      employeeName: "Rahul Shinde",
      partNumber: "PP-102",
      partName: "Pressure Valve Plate",
      targetCount: 1000,
      achievedCount: 320,
      issueNotes: "Machine vibration reported"
    }
  ]
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    assignTask(state, action: PayloadAction<Task>) {
      state.items.push(action.payload);
    },
    updateTaskCount(state, action: PayloadAction<{ id: string; increment: number; issueNotes?: string }>) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (!task) return;
      task.achievedCount += action.payload.increment;
      if (action.payload.issueNotes) {
        task.issueNotes = action.payload.issueNotes;
      }
    },
    addManagerSuggestion(state, action: PayloadAction<{ id: string; suggestion: string }>) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (!task) return;
      task.managerSuggestion = action.payload.suggestion;
    }
  }
});

export const { assignTask, updateTaskCount, addManagerSuggestion } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
