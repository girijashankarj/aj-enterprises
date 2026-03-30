import { getMobileMockBootstrap } from "@aj/mock-api";
import { FormEvent, useMemo, useState } from "react";
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isMockApiMode } from "./mocks/config";
import { tokens } from "./theme";
import { AppButton, AppCard, AppInput, SectionTitle } from "./ui";

type Role = "EMPLOYEE" | "ADMIN";

type Task = {
  id: string;
  partName: string;
  partNumber: string;
  targetCount: number;
  achievedCount: number;
  issue?: string;
};

const roleSlice = createSlice({
  name: "role",
  initialState: { value: "EMPLOYEE" as Role },
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.value = action.payload;
    }
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState: {
    items: [
      { id: "t1", partName: "Pressure Plate", partNumber: "PP-102", targetCount: 1000, achievedCount: 300 }
    ] as Task[]
  },
  reducers: {
    updateCount: (state, action: PayloadAction<{ id: string; increment: number; issue?: string }>) => {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (!task) return;
      task.achievedCount += action.payload.increment;
      if (action.payload.issue) task.issue = action.payload.issue;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    }
  }
});

const leaveSlice = createSlice({
  name: "leave",
  initialState: { requests: [{ id: "l1", fromDate: "2026-04-03", toDate: "2026-04-04", status: "PENDING" }] },
  reducers: {
    addLeave: (state, action: PayloadAction<{ id: string; fromDate: string; toDate: string; status: string }>) => {
      state.requests.push(action.payload);
    }
  }
});

const financeSlice = createSlice({
  name: "finance",
  initialState: { pending: 5000, advanceTaken: 3000 },
  reducers: {}
});

const USE_MOCK = isMockApiMode();
const mb = getMobileMockBootstrap();

function resolveInitialRole(): Role {
  const r = process.env.EXPO_PUBLIC_INITIAL_ROLE;
  if (r === "ADMIN" || r === "EMPLOYEE") return r;
  return USE_MOCK ? mb.role : "EMPLOYEE";
}

const defaultMobilePreload = {
  role: { value: "EMPLOYEE" as Role },
  task: {
    items: [{ id: "t1", partName: "Pressure Plate", partNumber: "PP-102", targetCount: 1000, achievedCount: 300 }] as Task[]
  },
  leave: { requests: [{ id: "l1", fromDate: "2026-04-03", toDate: "2026-04-04", status: "PENDING" as const }] },
  finance: { pending: 5000, advanceTaken: 3000 }
};

const preloadedState = USE_MOCK
  ? {
      role: { value: resolveInitialRole() },
      task: { items: mb.tasks },
      leave: { requests: mb.leave.requests },
      finance: mb.finance
    }
  : {
      ...defaultMobilePreload,
      role: { value: resolveInitialRole() }
    };

const store = configureStore({
  reducer: {
    role: roleSlice.reducer,
    task: taskSlice.reducer,
    leave: leaveSlice.reducer,
    finance: financeSlice.reducer
  },
  preloadedState
});

type RootState = ReturnType<typeof store.getState>;

function Shell() {
  const [tab, setTab] = useState<"tasks" | "leave" | "salary" | "location" | "admin">(() =>
    process.env.EXPO_PUBLIC_INITIAL_ROLE === "ADMIN" ? "admin" : "tasks"
  );
  const state = store.getState() as RootState;
  const role = state.role.value;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>AJ Enterprises Mobile</Text>
        <Text style={styles.subtitle}>Role-based app shell (Phase 1)</Text>
      </View>
      <View style={styles.chipRow}>
        {(["EMPLOYEE", "ADMIN"] as Role[]).map((item) => (
          <Pressable key={item} onPress={() => store.dispatch(roleSlice.actions.setRole(item))} style={[styles.chip, role === item ? styles.chipActive : styles.chipIdle]}>
            <Text style={styles.chipText}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.chipRowWrap}>
        {(["tasks", "leave", "salary", "location", "admin"] as const).map((item) => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.chip, tab === item ? styles.chipActive : styles.chipIdle]}>
            <Text style={styles.chipText}>{item.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView style={styles.scroll}>
        {tab === "tasks" ? <EmployeeTasks /> : null}
        {tab === "leave" ? <LeaveCard /> : null}
        {tab === "salary" ? <SalaryCard /> : null}
        {tab === "location" ? <LocationCard /> : null}
        {tab === "admin" ? <AdminCard role={role} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmployeeTasks() {
  const tasks = store.getState().task.items;
  const [issue, setIssue] = useState("");

  return (
    <View style={styles.sectionStack}>
      {tasks.map((task) => (
        <AppCard key={task.id}>
          <SectionTitle>{task.partName} ({task.partNumber})</SectionTitle>
          <Text style={styles.secondaryText}>{task.achievedCount}/{task.targetCount}</Text>
          <AppInput value={issue} onChangeText={setIssue} placeholder="Issue note" />
          <AppButton
            label="Update +50"
            variant="success"
            onPress={() => store.dispatch(taskSlice.actions.updateCount({ id: task.id, increment: 50, issue }))}
          />
          {task.issue ? <Text style={styles.warningText}>Issue: {task.issue}</Text> : null}
        </AppCard>
      ))}
    </View>
  );
}

function LeaveCard() {
  const leave = store.getState().leave.requests;
  const [fromDate, setFromDate] = useState("2026-04-10");
  const [toDate, setToDate] = useState("2026-04-11");

  return (
    <AppCard>
      <SectionTitle>Leave Requests</SectionTitle>
      <AppInput value={fromDate} onChangeText={setFromDate} />
      <AppInput value={toDate} onChangeText={setToDate} />
      <AppButton
        label="Request Leave"
        onPress={() => store.dispatch(leaveSlice.actions.addLeave({ id: crypto.randomUUID(), fromDate, toDate, status: "PENDING" }))}
      />
      {leave.map((x) => <Text key={x.id} style={styles.secondaryText}>{x.fromDate} to {x.toDate} ({x.status})</Text>)}
    </AppCard>
  );
}

function SalaryCard() {
  const salary = store.getState().finance;
  return (
    <AppCard>
      <SectionTitle>Salary Snapshot</SectionTitle>
      <Text style={styles.secondaryText}>Advance Taken: Rs. {salary.advanceTaken}</Text>
      <Text style={styles.secondaryText}>Pending Payment: Rs. {salary.pending}</Text>
    </AppCard>
  );
}

function LocationCard() {
  const lat = process.env.EXPO_PUBLIC_WORKSHOP_LATITUDE ?? "18.6298";
  const lng = process.env.EXPO_PUBLIC_WORKSHOP_LONGITUDE ?? "73.8478";
  const workshopName = process.env.EXPO_PUBLIC_WORKSHOP_NAME ?? "AJ Enterprises";
  const mapUrl = process.env.EXPO_PUBLIC_WORKSHOP_MAP_URL ?? `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <AppCard>
      <SectionTitle>Workshop Location</SectionTitle>
      <Text style={styles.secondaryText}>{workshopName}</Text>
      <Text style={styles.secondaryText}>Coordinates: {lat}, {lng}</Text>
      <AppButton label="Open in Google Maps" onPress={() => void Linking.openURL(mapUrl)} />
    </AppCard>
  );
}

function AdminCard({ role }: { role: Role }) {
  const [employeeName, setEmployeeName] = useState("New Employee");
  const [partName, setPartName] = useState("Latte Pump Shell");
  const canManage = useMemo(() => role === "ADMIN", [role]);

  if (!canManage) {
    return (
      <AppCard>
        <Text style={styles.warningText}>Switch role to ADMIN for manager actions.</Text>
      </AppCard>
    );
  }

  return (
    <AppCard>
      <SectionTitle>Admin/Manager Quick Actions</SectionTitle>
      <AppInput value={employeeName} onChangeText={setEmployeeName} />
      <AppButton label="Add Employee (scaffold)" />
      <AppInput value={partName} onChangeText={setPartName} />
      <AppButton
        label="Assign Task (scaffold)"
        onPress={() => store.dispatch(taskSlice.actions.addTask({ id: crypto.randomUUID(), partName, partNumber: "PN-NEW", targetCount: 1000, achievedCount: 0 }))}
      />
    </AppCard>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Shell />
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bgCanvas
  },
  header: {
    padding: tokens.spacing.lg
  },
  title: {
    color: tokens.color.textPrimary,
    fontSize: 22,
    fontWeight: "700"
  },
  subtitle: {
    color: tokens.color.textSecondary,
    marginTop: tokens.spacing.xs
  },
  chipRow: {
    flexDirection: "row",
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.sm
  },
  chipRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.lg
  },
  chip: {
    borderRadius: tokens.radius.control,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  chipActive: {
    backgroundColor: tokens.color.brandPrimary
  },
  chipIdle: {
    backgroundColor: tokens.color.bgSubtle
  },
  chipText: {
    color: tokens.color.textPrimary
  },
  scroll: {
    flex: 1,
    padding: tokens.spacing.lg
  },
  sectionStack: {
    gap: tokens.spacing.md
  },
  secondaryText: {
    color: tokens.color.textSecondary
  },
  warningText: {
    color: tokens.color.warning
  }
});
