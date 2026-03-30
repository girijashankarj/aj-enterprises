import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { akApi } from "./api/akApi";
import { addEmployee } from "./slices/employeesSlice";
import { assignTask, updateTaskCount } from "./slices/tasksSlice";
import { addLedgerEntry } from "./slices/financeSlice";
import { addLeaveRequest } from "./slices/leaveSlice";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(addEmployee),
  effect: (_action, api) => {
    api.dispatch(akApi.util.invalidateTags(["Employees"]));
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(assignTask, updateTaskCount),
  effect: (_action, api) => {
    api.dispatch(akApi.util.invalidateTags(["Tasks"]));
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(addLedgerEntry),
  effect: (_action, api) => {
    api.dispatch(akApi.util.invalidateTags(["Finance"]));
  }
});

listenerMiddleware.startListening({
  matcher: isAnyOf(addLeaveRequest),
  effect: (_action, api) => {
    api.dispatch(akApi.util.invalidateTags(["Leave"]));
  }
});
