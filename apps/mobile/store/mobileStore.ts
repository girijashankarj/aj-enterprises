import { getMobileMockBootstrap } from "@aj/mock-api";
import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isMockApiMode } from "../mocks/config";

/** Mock UI uses ADMIN; live uses full API roles. */
export type UiRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

export type MobileTask = {
  id: string;
  partName: string;
  partNumber: string;
  targetCount: number;
  achievedCount: number;
  issue?: string;
};

export type LeaveRequestRow = {
  id: string;
  fromDate: string;
  toDate: string;
  status: string;
};

const roleSlice = createSlice({
  name: "role",
  initialState: { value: "EMPLOYEE" as UiRole },
  reducers: {
    setRole: (state, action: PayloadAction<UiRole>) => {
      state.value = action.payload;
    },
    setRoleFromApi: (state, action: PayloadAction<UiRole>) => {
      state.value = action.payload;
    }
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState: { items: [] as MobileTask[] },
  reducers: {
    hydrateTasks: (state, action: PayloadAction<MobileTask[]>) => {
      state.items = action.payload;
    },
    updateCount: (
      state,
      action: PayloadAction<{ id: string; increment: number; issue?: string }>
    ) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (!task) return;
      task.achievedCount += action.payload.increment;
      if (action.payload.issue) task.issue = action.payload.issue;
    },
    patchTask: (state, action: PayloadAction<MobileTask>) => {
      const i = state.items.findIndex((t) => t.id === action.payload.id);
      if (i >= 0) state.items[i] = action.payload;
    },
    addTask: (state, action: PayloadAction<MobileTask>) => {
      state.items.push(action.payload);
    }
  }
});

const leaveSlice = createSlice({
  name: "leave",
  initialState: { requests: [] as LeaveRequestRow[] },
  reducers: {
    hydrateLeave: (state, action: PayloadAction<LeaveRequestRow[]>) => {
      state.requests = action.payload;
    },
    addLeave: (state, action: PayloadAction<LeaveRequestRow>) => {
      state.requests.push(action.payload);
    }
  }
});

const financeSlice = createSlice({
  name: "finance",
  initialState: { pending: 0, advanceTaken: 0 },
  reducers: {
    hydrateFinance: (state, action: PayloadAction<{ pending: number; advanceTaken: number }>) => {
      state.pending = action.payload.pending;
      state.advanceTaken = action.payload.advanceTaken;
    }
  }
});

const USE_MOCK = isMockApiMode();
const mb = getMobileMockBootstrap();

function resolveMockInitialRole(): UiRole {
  const r = process.env.EXPO_PUBLIC_INITIAL_ROLE;
  if (r === "ADMIN") return "ADMIN";
  if (r === "MANAGER") return "MANAGER";
  if (r === "EMPLOYEE") return "EMPLOYEE";
  return "EMPLOYEE";
}

const emptyLive = {
  role: { value: "EMPLOYEE" as UiRole },
  task: { items: [] as MobileTask[] },
  leave: { requests: [] as LeaveRequestRow[] },
  finance: { pending: 0, advanceTaken: 0 }
};

const preloadedState = USE_MOCK
  ? {
      role: { value: resolveMockInitialRole() },
      task: { items: mb.tasks },
      leave: { requests: mb.leave.requests },
      finance: mb.finance
    }
  : emptyLive;

export const store = configureStore({
  reducer: {
    role: roleSlice.reducer,
    task: taskSlice.reducer,
    leave: leaveSlice.reducer,
    finance: financeSlice.reducer
  },
  preloadedState
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const roleActions = roleSlice.actions;
export const taskActions = taskSlice.actions;
export const leaveActions = leaveSlice.actions;
export const financeActions = financeSlice.actions;

export { USE_MOCK };
