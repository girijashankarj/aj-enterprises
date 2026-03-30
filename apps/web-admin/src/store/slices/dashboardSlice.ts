import { createSlice } from "@reduxjs/toolkit";

type DashboardState = {
  dayAchieved: number;
  dayTarget: number;
  weekAchieved: number;
  weekTarget: number;
};

const initialState: DashboardState = {
  dayAchieved: 320,
  dayTarget: 1000,
  weekAchieved: 2200,
  weekTarget: 5000
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {}
});

export const dashboardReducer = dashboardSlice.reducer;
