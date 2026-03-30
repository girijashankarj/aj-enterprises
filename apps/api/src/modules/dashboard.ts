import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler, validateQuery } from "../lib/http";
import { requireAuth } from "../middleware/auth";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

const summaryQuerySchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  employeeId: z.string().optional()
});

dashboardRouter.get("/summary", validateQuery(summaryQuerySchema), asyncHandler(async (req, res) => {
  const { fromDate, toDate, employeeId } = summaryQuerySchema.parse(req.query);
  const rangeFrom = fromDate ? new Date(fromDate) : new Date(new Date().setHours(0, 0, 0, 0));
  const rangeTo = toDate ? new Date(toDate) : new Date();

  const where = {
    assignmentDate: { gte: rangeFrom, lte: rangeTo },
    ...(employeeId ? { employeeId } : {})
  };

  const tasks = await prisma.taskAssignment.findMany({ where });
  const dayAchieved = tasks.reduce((acc: number, t) => acc + t.achievedCount, 0);
  const dayTarget = tasks.reduce((acc: number, t) => acc + t.targetCount, 0);
  const byEmployee = tasks.reduce<Record<string, { achieved: number; target: number }>>((acc, item) => {
    const existing = acc[item.employeeId] ?? { achieved: 0, target: 0 };
    existing.achieved += item.achievedCount;
    existing.target += item.targetCount;
    acc[item.employeeId] = existing;
    return acc;
  }, {});
  res.json({
    day: { achieved: dayAchieved, target: dayTarget },
    week: { achieved: dayAchieved, target: dayTarget },
    byEmployee
  });
}));
