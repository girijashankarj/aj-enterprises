import { env } from "../config/env";

export type NotificationChannel = "email" | "sms";
export type NotificationEvent =
  | "TASK_ASSIGNED"
  | "LEAVE_STATUS_CHANGED"
  | "FINANCE_UPDATED"
  | "DAILY_SUMMARY"
  | "PUBLIC_LEAD_SUBMITTED";

export type NotificationDispatchPayload = {
  event: NotificationEvent;
  channels: NotificationChannel[];
  recipients: {
    emails?: string[];
    phoneNumbers?: string[];
  };
  message: string;
  subject?: string;
};

export type NotificationDispatchResult = {
  provider: "none" | "custom";
  email: { attempted: boolean; sent: boolean; reason?: string };
  sms: { attempted: boolean; sent: boolean; reason?: string };
};

export const dispatchNotification = async (
  payload: NotificationDispatchPayload
): Promise<NotificationDispatchResult> => {
  const wantsEmail = payload.channels.includes("email");
  const wantsSms = payload.channels.includes("sms");

  const emailEnabled = env.EMAIL_NOTIFICATIONS_ENABLED;
  const smsEnabled = env.SMS_NOTIFICATIONS_ENABLED;

  const result: NotificationDispatchResult = {
    provider: env.NOTIFICATION_PROVIDER,
    email: {
      attempted: wantsEmail,
      sent: false,
      reason: wantsEmail ? "Email provider not configured yet" : "Channel not requested"
    },
    sms: {
      attempted: wantsSms,
      sent: false,
      reason: wantsSms ? "SMS provider not configured yet" : "Channel not requested"
    }
  };

  if (!wantsEmail && !wantsSms) {
    return result;
  }

  if (wantsEmail && !emailEnabled) {
    result.email.reason = "Email notifications disabled by env";
  }
  if (wantsSms && !smsEnabled) {
    result.sms.reason = "SMS notifications disabled by env";
  }

  if (env.NOTIFICATION_PROVIDER === "none") {
    return result;
  }

  // Placeholder for custom provider integration. This path is intentionally
  // left non-sending until provider SDK/details are finalized.
  return result;
};
