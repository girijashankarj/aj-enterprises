import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { notifyPublicLeadCreated } from "../lib/publicLeadNotify";

export const publicRouter = Router();

const leadSubmitLimiter = rateLimit({
  windowMs: env.PUBLIC_LEAD_RATE_WINDOW_MS,
  max: env.PUBLIC_LEAD_RATE_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT",
        message: "Too many submissions. Please try again later."
      }
    });
  }
});

const optionalUrl = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : v),
  z.string().url().max(2000).optional()
);

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(8000),
  pageUrl: optionalUrl,
  referrer: z.string().max(2000).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  /** Honeypot — must stay empty (bots often fill hidden fields). */
  company: z.string().max(200).optional()
});

publicRouter.post("/leads", leadSubmitLimiter, async (req, res, next) => {
  try {
    const parsed = bodySchema.parse(req.body);
    if (parsed.company?.trim()) {
      return res.status(201).json({ ok: true });
    }

    const { company: _company, ...rest } = parsed;

    const lead = await prisma.publicLead.create({
      data: {
        name: rest.name,
        email: rest.email,
        subject: rest.subject,
        message: rest.message,
        pageUrl: rest.pageUrl ?? null,
        referrer: rest.referrer?.trim() ? rest.referrer : null,
        utmSource: rest.utmSource?.trim() ? rest.utmSource : null,
        utmMedium: rest.utmMedium?.trim() ? rest.utmMedium : null,
        utmCampaign: rest.utmCampaign?.trim() ? rest.utmCampaign : null
      }
    });

    void notifyPublicLeadCreated(lead).catch(() => {
      // Notification failure must not block the client response.
    });

    return res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});
