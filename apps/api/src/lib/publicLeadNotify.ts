import type { PublicLead } from "@prisma/client";
import { env } from "../config/env";
import { dispatchNotification } from "./notifications";

/**
 * Queue email notification for a new public contact lead (RFQ).
 * Sends only when `PUBLIC_LEAD_NOTIFY_EMAIL` and `EMAIL_NOTIFICATIONS_ENABLED` are set;
 * provider integration remains in `dispatchNotification` (`NOTIFICATION_PROVIDER`).
 */
export async function notifyPublicLeadCreated(lead: PublicLead): Promise<void> {
  const raw = env.PUBLIC_LEAD_NOTIFY_EMAIL?.trim();
  const emails = raw ? raw.split(",").map((e) => e.trim()).filter(Boolean) : [];
  if (emails.length === 0 || !env.EMAIL_NOTIFICATIONS_ENABLED) {
    return;
  }

  await dispatchNotification({
    event: "PUBLIC_LEAD_SUBMITTED",
    channels: ["email"],
    recipients: { emails },
    subject: `[Public lead] ${lead.subject}`,
    message: `From: ${lead.name} <${lead.email}>\nSubject: ${lead.subject}\n\n${lead.message}`
  });
}
