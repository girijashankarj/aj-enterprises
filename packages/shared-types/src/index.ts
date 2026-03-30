import { z } from "zod";

export const userRoleSchema = z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const taskAssignmentSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  assignmentDate: z.string(),
  targetCount: z.number(),
  achievedCount: z.number(),
  status: z.enum(["PENDING", "IN_PROGRESS", "BLOCKED", "COMPLETED"]),
  issueNotes: z.string().nullable().optional(),
  managerNotes: z.string().nullable().optional()
});

export type TaskAssignmentDto = z.infer<typeof taskAssignmentSchema>;

export const dashboardSummarySchema = z.object({
  day: z.object({ achieved: z.number(), target: z.number() }),
  week: z.object({ achieved: z.number(), target: z.number() })
});

export type DashboardSummaryDto = z.infer<typeof dashboardSummarySchema>;
