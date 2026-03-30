import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().default("4000"),
  JWT_SECRET: z.string().min(8),
  CORS_ORIGINS: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  NOTIFICATION_PROVIDER: z.enum(["none", "custom"]).default("none"),
  EMAIL_NOTIFICATIONS_ENABLED: z.coerce.boolean().default(false),
  SMS_NOTIFICATIONS_ENABLED: z.coerce.boolean().default(false),
  WORKSHOP_NAME: z.string().default("AJ Enterprises"),
  WORKSHOP_LATITUDE: z.coerce.number().default(18.6298),
  WORKSHOP_LONGITUDE: z.coerce.number().default(73.8478),
  /** Trust `X-Forwarded-*` (e.g. behind Nginx) for rate-limit IP. */
  TRUST_PROXY: z.coerce.boolean().default(false),
  /** Comma-separated emails for new public lead notifications (requires `EMAIL_NOTIFICATIONS_ENABLED`). */
  PUBLIC_LEAD_NOTIFY_EMAIL: z.string().optional(),
  PUBLIC_LEAD_RATE_MAX: z.coerce.number().int().positive().default(5),
  PUBLIC_LEAD_RATE_WINDOW_MS: z.coerce.number().int().positive().default(900_000)
});

export const env = envSchema.parse(process.env);
