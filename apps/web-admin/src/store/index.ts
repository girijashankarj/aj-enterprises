import { configureStore } from "@reduxjs/toolkit";
import { getWebPreloadedState } from "../mocks/webPreload";
import { akApi } from "./api/akApi";
import { listenerMiddleware } from "./listeners";
import { attendanceReducer } from "./slices/attendanceSlice";
import { authReducer } from "./slices/authSlice";
import { dashboardReducer } from "./slices/dashboardSlice";
import { employeesReducer } from "./slices/employeesSlice";
import { financeReducer } from "./slices/financeSlice";
import { leaveReducer } from "./slices/leaveSlice";
import { tasksReducer } from "./slices/tasksSlice";
import { themeReducer } from "./slices/themeSlice";
import { toastReducer } from "./slices/toastSlice";
import { preferencesReducer } from "./slices/preferencesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    preferences: preferencesReducer,
    toast: toastReducer,
    employees: employeesReducer,
    tasks: tasksReducer,
    dashboard: dashboardReducer,
    finance: financeReducer,
    leave: leaveReducer,
    attendance: attendanceReducer,
    [akApi.reducerPath]: akApi.reducer
  },
  preloadedState: getWebPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(akApi.middleware).prepend(listenerMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
