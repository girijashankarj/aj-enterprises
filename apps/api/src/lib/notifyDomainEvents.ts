import { prisma } from "./prisma";
import { dispatchNotification } from "./notifications";

function fireAndForget(promise: Promise<unknown>): void {
  void promise.catch(() => {
    console.error("Notification pipeline error");
  });
}

async function loadUserRecipients(userId: string): Promise<{ emails: string[]; phoneNumbers: string[] } | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { employeeProfile: true }
  });
  if (!user?.isActive) return null;
  return {
    emails: [user.email],
    phoneNumbers: user.employeeProfile?.phone ? [user.employeeProfile.phone] : []
  };
}

export function queueNotifyTaskAssigned(params: {
  employeeId: string;
  partName: string;
  partNumber: string;
  targetCount: number;
  assignmentDateLabel: string;
}): void {
  fireAndForget(
    (async () => {
      const recipients = await loadUserRecipients(params.employeeId);
      if (!recipients) return;
      await dispatchNotification({
        event: "TASK_ASSIGNED",
        channels: ["email", "sms"],
        recipients,
        subject: `New task: ${params.partName}`,
        message: `You were assigned ${params.partName} (${params.partNumber}) with target ${params.targetCount} for ${params.assignmentDateLabel}.`
      });
    })()
  );
}

export function queueNotifyLeaveStatusChanged(params: {
  employeeId: string;
  status: "APPROVED" | "REJECTED";
  fromDate: Date;
  toDate: Date;
}): void {
  fireAndForget(
    (async () => {
      const recipients = await loadUserRecipients(params.employeeId);
      if (!recipients) return;
      const from = params.fromDate.toISOString().slice(0, 10);
      const to = params.toDate.toISOString().slice(0, 10);
      await dispatchNotification({
        event: "LEAVE_STATUS_CHANGED",
        channels: ["email", "sms"],
        recipients,
        subject: `Leave ${params.status.toLowerCase()}`,
        message: `Your leave request (${from} to ${to}) was ${params.status.toLowerCase()}.`
      });
    })()
  );
}

export function queueNotifyFinanceUpdated(params: {
  employeeId: string;
  entryType: string;
  amount: string;
  note?: string | null;
}): void {
  fireAndForget(
    (async () => {
      const recipients = await loadUserRecipients(params.employeeId);
      if (!recipients) return;
      const noteLine = params.note ? ` Note: ${params.note}` : "";
      await dispatchNotification({
        event: "FINANCE_UPDATED",
        channels: ["email", "sms"],
        recipients,
        subject: `Salary ledger: ${params.entryType}`,
        message: `A ${params.entryType} entry of ${params.amount} was recorded.${noteLine}`
      });
    })()
  );
}

export async function notifyDailySummaryForDate(date: Date): Promise<void> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const tasks = await prisma.taskAssignment.findMany({
    where: { assignmentDate: { gte: start, lte: end } }
  });
  const dayAchieved = tasks.reduce((acc, t) => acc + t.achievedCount, 0);
  const dayTarget = tasks.reduce((acc, t) => acc + t.targetCount, 0);

  const managers = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "MANAGER"] }, isActive: true },
    include: { employeeProfile: true }
  });
  const emails = managers.map((m) => m.email);
  const phoneNumbers = managers.flatMap((m) => (m.employeeProfile?.phone ? [m.employeeProfile.phone] : []));

  const dateLabel = start.toISOString().slice(0, 10);
  await dispatchNotification({
    event: "DAILY_SUMMARY",
    channels: ["email", "sms"],
    recipients: { emails, phoneNumbers },
    subject: `Daily production summary ${dateLabel}`,
    message: `Daily summary (${dateLabel}): achieved ${dayAchieved} / target ${dayTarget} across ${tasks.length} assignments.`
  });
}
