import { AJ_SITE_BRANDING } from "@aj/shared-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { LoginScreen } from "./components/LoginScreen";
import {
  assignTask,
  createEmployee,
  createLeaveRequest,
  fetchEmployees,
  postTaskProgress,
  type EmployeeRow
} from "./services/liveApi";
import {
  financeActions,
  leaveActions,
  roleActions,
  taskActions,
  store,
  USE_MOCK,
  type UiRole
} from "./store/mobileStore";
import { useAppSelector } from "./store/hooks";
import { tokens } from "./theme";
import { AppButton, AppCard, AppInput, SectionTitle } from "./ui";

function inclusiveDays(fromDate: string, toDate: string): number {
  const a = new Date(`${fromDate}T12:00:00.000Z`);
  const b = new Date(`${toDate}T12:00:00.000Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 1;
  const diff = Math.round((b.getTime() - a.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

function Root() {
  const { status } = useAuth();
  if (!USE_MOCK && status === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.secondaryText}>Loading…</Text>
      </SafeAreaView>
    );
  }
  if (!USE_MOCK && status === "signedOut") {
    return <LoginScreen />;
  }
  return <Shell />;
}

function Shell() {
  const [tab, setTab] = useState<"tasks" | "leave" | "salary" | "location" | "admin">(() => {
    const r = process.env.EXPO_PUBLIC_INITIAL_ROLE;
    return r === "ADMIN" || r === "MANAGER" ? "admin" : "tasks";
  });
  const role = useAppSelector((s) => s.role.value);
  const { session, signOut, refreshData } = useAuth();

  const liveRoleLabel = session?.role ?? null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>{AJ_SITE_BRANDING.name}</Text>
        <Text style={styles.subtitle}>{AJ_SITE_BRANDING.mobileTagline}</Text>
        {!USE_MOCK && session ? (
          <View style={styles.sessionRow}>
            <Text style={styles.sessionText} numberOfLines={1}>
              {session.email} · {liveRoleLabel}
            </Text>
            <AppButton label="Sign out" variant="secondary" onPress={() => void signOut()} />
          </View>
        ) : null}
      </View>
      {USE_MOCK ? (
        <View style={styles.chipRow}>
          {(["EMPLOYEE", "MANAGER", "ADMIN"] as UiRole[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => store.dispatch(roleActions.setRole(item))}
              style={[styles.chip, role === item ? styles.chipActive : styles.chipIdle]}
            >
              <Text style={styles.chipText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.chipRow}>
          <Text style={styles.sessionText}>Role: {liveRoleLabel}</Text>
        </View>
      )}
      <View style={styles.chipRowWrap}>
        {(["tasks", "leave", "salary", "location", "admin"] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setTab(item)}
            style={[styles.chip, tab === item ? styles.chipActive : styles.chipIdle]}
          >
            <Text style={styles.chipText}>{item.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView style={styles.scroll}>
        {tab === "tasks" ? <EmployeeTasks refreshData={refreshData} /> : null}
        {tab === "leave" ? <LeaveCard refreshData={refreshData} /> : null}
        {tab === "salary" ? <SalaryCard /> : null}
        {tab === "location" ? <LocationCard /> : null}
        {tab === "admin" ? <AdminCard refreshData={refreshData} role={role} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmployeeTasks({ refreshData }: { refreshData: () => Promise<void> }) {
  const tasks = useAppSelector((s) => s.task.items);
  const [issue, setIssue] = useState("");
  const { session } = useAuth();

  const onUpdate = useCallback(
    async (taskId: string) => {
      if (USE_MOCK || !session) {
        store.dispatch(taskActions.updateCount({ id: taskId, increment: 50, issue }));
        return;
      }
      await postTaskProgress(session.token, taskId, {
        incrementCount: 50,
        issueNotes: issue.trim() || undefined,
        employeeId: session.userId
      });
      await refreshData();
      setIssue("");
    },
    [issue, session, refreshData]
  );

  return (
    <View style={styles.sectionStack}>
      {tasks.length === 0 ? (
        <Text style={styles.secondaryText}>No tasks assigned.</Text>
      ) : null}
      {tasks.map((task) => (
        <AppCard key={task.id}>
          <SectionTitle>
            {task.partName} ({task.partNumber})
          </SectionTitle>
          <Text style={styles.secondaryText}>
            {task.achievedCount}/{task.targetCount}
          </Text>
          <AppInput value={issue} onChangeText={setIssue} placeholder="Issue note" />
          <AppButton label="Update +50" variant="success" onPress={() => void onUpdate(task.id)} />
          {task.issue ? <Text style={styles.warningText}>Issue: {task.issue}</Text> : null}
        </AppCard>
      ))}
    </View>
  );
}

function LeaveCard({ refreshData }: { refreshData: () => Promise<void> }) {
  const leave = useAppSelector((s) => s.leave.requests);
  const [fromDate, setFromDate] = useState("2026-04-10");
  const [toDate, setToDate] = useState("2026-04-11");
  const { session } = useAuth();

  const submit = useCallback(async () => {
    if (USE_MOCK || !session) {
      store.dispatch(
        leaveActions.addLeave({
          id: crypto.randomUUID(),
          fromDate,
          toDate,
          status: "PENDING"
        })
      );
      return;
    }
    await createLeaveRequest(session.token, {
      employeeId: session.userId,
      fromDate,
      toDate,
      totalDays: inclusiveDays(fromDate, toDate),
      reason: undefined
    });
    await refreshData();
  }, [fromDate, toDate, session, refreshData]);

  return (
    <AppCard>
      <SectionTitle>Leave Requests</SectionTitle>
      <AppInput value={fromDate} onChangeText={setFromDate} />
      <AppInput value={toDate} onChangeText={setToDate} />
      <AppButton label="Request Leave" onPress={() => void submit()} />
      {leave.map((x) => (
        <Text key={x.id} style={styles.secondaryText}>
          {x.fromDate} to {x.toDate} ({x.status})
        </Text>
      ))}
    </AppCard>
  );
}

function SalaryCard() {
  const salary = useAppSelector((s) => s.finance);
  const { session } = useAuth();

  if (!USE_MOCK && session?.role === "EMPLOYEE") {
    return (
      <AppCard>
        <SectionTitle>Salary Snapshot</SectionTitle>
        <Text style={styles.secondaryText}>
          Detailed salary ledger is available to managers and admins. Use the web admin app for full history, or ask your
          manager.
        </Text>
      </AppCard>
    );
  }

  return (
    <AppCard>
      <SectionTitle>Salary Snapshot</SectionTitle>
      <Text style={styles.secondaryText}>Advance Taken: Rs. {salary.advanceTaken}</Text>
      <Text style={styles.secondaryText}>Pending Payment: Rs. {salary.pending}</Text>
      {!USE_MOCK && session && (session.role === "ADMIN" || session.role === "MANAGER") ? (
        <Text style={styles.secondaryText}>Prototype: first employee in directory used for totals.</Text>
      ) : null}
    </AppCard>
  );
}

function LocationCard() {
  const lat = process.env.EXPO_PUBLIC_WORKSHOP_LATITUDE ?? "18.6298";
  const lng = process.env.EXPO_PUBLIC_WORKSHOP_LONGITUDE ?? "73.8478";
  const workshopName = process.env.EXPO_PUBLIC_WORKSHOP_NAME ?? AJ_SITE_BRANDING.name;
  const mapUrl = process.env.EXPO_PUBLIC_WORKSHOP_MAP_URL ?? `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <AppCard>
      <SectionTitle>Workshop Location</SectionTitle>
      <Text style={styles.secondaryText}>{workshopName}</Text>
      <Text style={styles.secondaryText}>
        Coordinates: {lat}, {lng}
      </Text>
      <AppButton label="Open in Google Maps" onPress={() => void Linking.openURL(mapUrl)} />
    </AppCard>
  );
}

function AdminCard({ role, refreshData }: { role: UiRole; refreshData: () => Promise<void> }) {
  const [employeeName, setEmployeeName] = useState("New Employee");
  const [employeeEmail, setEmployeeEmail] = useState("employee@example.com");
  const [salaryBase, setSalaryBase] = useState("18000");
  const [partName, setPartName] = useState("Latte Pump Shell");
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [targetEmployeeId, setTargetEmployeeId] = useState<string | null>(null);
  const { session } = useAuth();

  const canManage = useMemo(() => role === "ADMIN" || role === "MANAGER", [role]);

  useEffect(() => {
    if (!canManage || USE_MOCK || !session) return;
    let cancelled = false;
    void fetchEmployees(session.token)
      .then((list) => {
        if (cancelled) return;
        setEmployees(list);
        setTargetEmployeeId((prev) => prev ?? list[0]?.id ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [canManage, session]);

  if (!canManage) {
    return (
      <AppCard>
        <Text style={styles.warningText}>Manager or admin role required for these actions.</Text>
      </AppCard>
    );
  }

  const addEmployee = useCallback(async () => {
    if (USE_MOCK || !session) return;
    const sal = Number(salaryBase);
    if (!Number.isFinite(sal) || sal < 0) return;
    await createEmployee(session.token, {
      email: employeeEmail.trim(),
      fullName: employeeName.trim(),
      salaryBase: sal
    });
    await refreshData();
    const list = await fetchEmployees(session.token);
    setEmployees(list);
  }, [employeeEmail, employeeName, salaryBase, session, refreshData]);

  const assignTaskLive = useCallback(async () => {
    if (USE_MOCK || !session || !targetEmployeeId) return;
    const day = new Date().toISOString().slice(0, 10);
    await assignTask(session.token, {
      employeeId: targetEmployeeId,
      assignedById: session.userId,
      assignmentDate: day,
      targetCount: 1000,
      partNumber: `PN-${Date.now()}`,
      partName: partName.trim() || "Assigned part"
    });
    await refreshData();
  }, [session, targetEmployeeId, partName, refreshData]);

  return (
    <AppCard>
      <SectionTitle>Admin / manager</SectionTitle>
      <AppInput value={employeeEmail} onChangeText={setEmployeeEmail} placeholder="Email" />
      <AppInput value={employeeName} onChangeText={setEmployeeName} placeholder="Full name" />
      <AppInput value={salaryBase} onChangeText={setSalaryBase} placeholder="Salary base (number)" keyboardType="numeric" />
      {USE_MOCK ? (
        <AppButton label="Add Employee (mock only)" variant="secondary" onPress={() => {}} />
      ) : (
        <AppButton label="Create employee (API)" onPress={() => void addEmployee()} />
      )}
      <AppInput value={partName} onChangeText={setPartName} placeholder="Part name" />
      {!USE_MOCK && employees.length > 0 ? (
        <Text style={styles.secondaryText}>
          Assign to: {employees.find((e) => e.id === targetEmployeeId)?.fullName ?? "—"} (first in list; prototype)
        </Text>
      ) : null}
      {USE_MOCK ? (
        <AppButton
          label="Assign task (mock)"
          onPress={() =>
            store.dispatch(
              taskActions.addTask({
                id: crypto.randomUUID(),
                partName,
                partNumber: "PN-NEW",
                targetCount: 1000,
                achievedCount: 0
              })
            )
          }
        />
      ) : (
        <AppButton label="Assign task (API)" onPress={() => void assignTaskLive()} />
      )}
    </AppCard>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bgCanvas
  },
  header: {
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.spacing.sm,
    flexWrap: "wrap"
  },
  sessionText: {
    color: tokens.color.textSecondary,
    fontSize: 12,
    flex: 1
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
    marginBottom: tokens.spacing.sm,
    flexWrap: "wrap",
    alignItems: "center"
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
