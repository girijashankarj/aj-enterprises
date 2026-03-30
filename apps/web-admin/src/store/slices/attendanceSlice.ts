import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AttendanceRow } from "../../types";

type AttendanceState = { records: AttendanceRow[] };

const initialState: AttendanceState = {
  records: []
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    upsertAttendanceRecord(state, action: PayloadAction<AttendanceRow>) {
      const idx = state.records.findIndex(
        (r) =>
          r.employeeProfileId === action.payload.employeeProfileId &&
          r.attendanceDate === action.payload.attendanceDate
      );
      if (idx >= 0) {
        state.records[idx] = action.payload;
      } else {
        state.records.unshift(action.payload);
      }
    }
  }
});

export const { upsertAttendanceRecord } = attendanceSlice.actions;
export const attendanceReducer = attendanceSlice.reducer;
