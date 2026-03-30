import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type LeaveEntry = {
  id: string;
  employeeName: string;
  fromDate: string;
  toDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

type LeaveState = { requests: LeaveEntry[] };

const initialState: LeaveState = {
  requests: [{ id: "leave-1", employeeName: "Rahul Shinde", fromDate: "2026-04-03", toDate: "2026-04-04", status: "PENDING" }]
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    addLeaveRequest(state, action: PayloadAction<LeaveEntry>) {
      state.requests.push(action.payload);
    }
  }
});

export const { addLeaveRequest } = leaveSlice.actions;
export const leaveReducer = leaveSlice.reducer;
