import cors from "cors";
import express from "express";
import morgan from "morgan";
import { ZodError } from "zod";
import { AppError, getValidationDetails } from "./lib/http";
import { env } from "./config/env";
import { marketingRouter } from "./modules/marketingLeads";
import { attendanceRouter } from "./modules/attendance";
import { authRouter } from "./modules/auth";
import { dashboardRouter } from "./modules/dashboard";
import { employeesRouter } from "./modules/employees";
import { financeRouter } from "./modules/finance";
import { leaveRouter } from "./modules/leave";
import { notificationsRouter } from "./modules/notifications";
import { publicRouter } from "./modules/publicLeads";
import { tasksRouter } from "./modules/tasks";

export const app = express();

if (env.TRUST_PROXY) {
  app.set("trust proxy", 1);
}

const corsOrigins = env.CORS_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new AppError(403, "Origin not allowed", "CORS_FORBIDDEN"));
    }
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/public", publicRouter);
app.use("/api/marketing", marketingRouter);
app.use("/api/auth", authRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/finance", financeRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/notifications", notificationsRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: getValidationDetails(err)
      }
    });
  }
  console.error(err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }
  });
});
