import { Router } from "express";
import { z } from "zod";
import { asyncHandler, validateBody } from "../lib/http";
import { dispatchNotification } from "../lib/notifications";
import { notifyDailySummaryForDate } from "../lib/notifyDomainEvents";
import { requireAuth, requireRole } from "../middleware/auth";
import { env } from "../config/env";

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

const dispatchBodySchema = z.object({
  event: z.enum(["TASK_ASSIGNED", "LEAVE_STATUS_CHANGED", "FINANCE_UPDATED", "DAILY_SUMMARY"]),
  channels: z.array(z.enum(["email", "sms"])).min(1),
  recipients: z
    .object({
      emails: z.array(z.string().email()).optional(),
      phoneNumbers: z.array(z.string().min(8)).optional()
    })
    .optional()
    .default({}),
  subject: z.string().min(1).optional(),
  message: z.string().min(1)
});

const dailySummaryBodySchema = z.object({
  date: z.string().min(1).optional()
});

notificationsRouter.get(
  "/workshop-location",
  requireRole(["ADMIN", "MANAGER", "EMPLOYEE"]),
  asyncHandler(async (_req, res) => {
    res.json({
      name: env.WORKSHOP_NAME,
      latitude: env.WORKSHOP_LATITUDE,
      longitude: env.WORKSHOP_LONGITUDE,
      mapUrl: `https://www.google.com/maps?q=${env.WORKSHOP_LATITUDE},${env.WORKSHOP_LONGITUDE}`
    });
  })
);

notificationsRouter.post(
  "/dispatch",
  requireRole(["ADMIN", "MANAGER"]),
  validateBody(dispatchBodySchema),
  asyncHandler(async (req, res) => {
    const payload = dispatchBodySchema.parse(req.body);
    const result = await dispatchNotification(payload);
    res.status(202).json({
      status: "accepted",
      event: payload.event,
      result
    });
  })
);

notificationsRouter.post(
  "/daily-summary",
  requireRole(["ADMIN", "MANAGER"]),
  validateBody(dailySummaryBodySchema),
  asyncHandler(async (req, res) => {
    const { date } = dailySummaryBodySchema.parse(req.body);
    const targetDate = date ? new Date(date) : new Date();
    await notifyDailySummaryForDate(targetDate);
    res.status(202).json({
      status: "accepted",
      date: targetDate.toISOString().slice(0, 10)
    });
  })
);
