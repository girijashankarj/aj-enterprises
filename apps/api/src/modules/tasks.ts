import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { queueNotifyTaskAssigned } from "../lib/notifyDomainEvents";
import { asyncHandler, validateBody, validateParams, validateQuery } from "../lib/http";
import { requireAuth, requireRole } from "../middleware/auth";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

const listTasksQuerySchema = z.object({
  employeeId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

const idParamSchema = z.object({ id: z.string().min(1) });

const assignTaskBodySchema = z.object({
  employeeId: z.string().min(1),
  assignedById: z.string().min(1),
  assignmentDate: z.string().min(1),
  targetCount: z.coerce.number().int().positive(),
  partNumber: z.string().min(1),
  partName: z.string().min(1)
});

const progressBodySchema = z.object({
  incrementCount: z.coerce.number().int().positive(),
  issueNotes: z.string().optional(),
  employeeId: z.string().min(1)
});

const suggestionBodySchema = z.object({
  suggestedById: z.string().min(1),
  comment: z.string().min(1)
});

tasksRouter.get("/", validateQuery(listTasksQuerySchema), asyncHandler(async (req, res) => {
  const { employeeId, page, limit } = listTasksQuerySchema.parse(req.query);
  const assignments = await prisma.taskAssignment.findMany({
    where: employeeId ? { employeeId } : undefined,
    include: { taskTemplate: true, progressLogs: true, suggestions: true },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { assignmentDate: "desc" }
  });
  res.json({ items: assignments, page, limit });
}));

tasksRouter.post("/assign", requireRole(["ADMIN", "MANAGER"]), validateBody(assignTaskBodySchema), asyncHandler(async (req, res) => {
  const { employeeId, assignedById, assignmentDate, targetCount, partNumber, partName } = assignTaskBodySchema.parse(req.body);

  const template = await prisma.taskTemplate.create({
    data: { partNumber, partName }
  });

  const task = await prisma.taskAssignment.create({
    data: {
      taskTemplateId: template.id,
      employeeId,
      assignedById,
      assignmentDate: new Date(assignmentDate),
      targetCount
    },
    include: { taskTemplate: true }
  });

  queueNotifyTaskAssigned({
    employeeId,
    partName: task.taskTemplate.partName,
    partNumber: task.taskTemplate.partNumber,
    targetCount,
    assignmentDateLabel: task.assignmentDate.toISOString().slice(0, 10)
  });

  res.status(201).json(task);
}));

tasksRouter.post("/:id/progress", validateParams(idParamSchema), validateBody(progressBodySchema), asyncHandler(async (req, res) => {
  const { incrementCount, issueNotes, employeeId } = progressBodySchema.parse(req.body);
  const { id: assignmentId } = idParamSchema.parse(req.params);
  const task = await prisma.taskAssignment.findUniqueOrThrow({ where: { id: assignmentId } });

  const currentCount = task.achievedCount + incrementCount;

  await prisma.taskProgressLog.create({
    data: {
      taskAssignmentId: task.id,
      incrementCount,
      currentCount,
      issueNotes,
      employeeId
    }
  });

  const updated = await prisma.taskAssignment.update({
    where: { id: task.id },
    data: {
      achievedCount: currentCount,
      issueNotes: issueNotes ?? task.issueNotes,
      status: currentCount >= task.targetCount ? "COMPLETED" : "IN_PROGRESS"
    }
  });

  res.json(updated);
}));

tasksRouter.post("/:id/suggestions", requireRole(["ADMIN", "MANAGER"]), validateParams(idParamSchema), validateBody(suggestionBodySchema), asyncHandler(async (req, res) => {
  const { id: assignmentId } = idParamSchema.parse(req.params);
  const { suggestedById, comment } = suggestionBodySchema.parse(req.body);
  const suggestion = await prisma.taskSuggestion.create({
    data: {
      taskAssignmentId: assignmentId,
      suggestedById,
      comment
    }
  });
  res.status(201).json(suggestion);
}));
