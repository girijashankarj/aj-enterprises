import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { queueNotifyLeaveStatusChanged } from "../lib/notifyDomainEvents";
import { asyncHandler, validateBody, validateParams } from "../lib/http";
import { requireAuth, requireRole } from "../middleware/auth";

export const leaveRouter = Router();

leaveRouter.use(requireAuth);

const employeeParamSchema = z.object({ employeeId: z.string().min(1) });
const createLeaveBodySchema = z.object({
  employeeId: z.string().min(1),
  fromDate: z.string().min(1),
  toDate: z.string().min(1),
  totalDays: z.coerce.number().int().positive(),
  reason: z.string().max(500).optional()
});
const leaveApprovalParamSchema = z.object({ id: z.string().min(1) });
const leaveApprovalBodySchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"])
});

leaveRouter.get("/requests/:employeeId", validateParams(employeeParamSchema), asyncHandler(async (req, res) => {
  const { employeeId } = employeeParamSchema.parse(req.params);
  const requests = await prisma.leaveRequest.findMany({
    where: { employeeId },
    orderBy: { fromDate: "desc" }
  });
  res.json(requests);
}));

leaveRouter.post("/requests", validateBody(createLeaveBodySchema), asyncHandler(async (req, res) => {
  const { employeeId, fromDate, toDate, totalDays, reason } = createLeaveBodySchema.parse(req.body);
  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      employeeId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      totalDays,
      reason
    }
  });
  res.status(201).json(leaveRequest);
}));

leaveRouter.patch(
  "/requests/:id/status",
  requireRole(["ADMIN", "MANAGER"]),
  validateParams(leaveApprovalParamSchema),
  validateBody(leaveApprovalBodySchema),
  asyncHandler(async (req, res) => {
    const { id } = leaveApprovalParamSchema.parse(req.params);
    const { status } = leaveApprovalBodySchema.parse(req.body);
    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: { status }
    });
    queueNotifyLeaveStatusChanged({
      employeeId: updated.employeeId,
      status,
      fromDate: updated.fromDate,
      toDate: updated.toDate
    });
    res.json(updated);
  })
);
