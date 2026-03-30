import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { queueNotifyFinanceUpdated } from "../lib/notifyDomainEvents";
import { asyncHandler, validateBody, validateParams } from "../lib/http";
import { requireAuth, requireRole } from "../middleware/auth";

export const financeRouter = Router();

financeRouter.use(requireAuth);

const employeeParamSchema = z.object({ employeeId: z.string().min(1) });
const createLedgerBodySchema = z.object({
  employeeId: z.string().min(1),
  entryType: z.enum(["ADVANCE", "SALARY_CREDIT", "DEDUCTION", "ADJUSTMENT"]),
  amount: z.coerce.number().positive(),
  note: z.string().max(500).optional()
});

financeRouter.get("/ledger/:employeeId", requireRole(["ADMIN", "MANAGER"]), validateParams(employeeParamSchema), asyncHandler(async (req, res) => {
  const { employeeId } = employeeParamSchema.parse(req.params);
  const entries = await prisma.salaryLedger.findMany({
    where: { employeeId },
    orderBy: { entryDate: "desc" }
  });
  res.json(entries);
}));

financeRouter.post("/ledger", requireRole(["ADMIN", "MANAGER"]), validateBody(createLedgerBodySchema), asyncHandler(async (req, res) => {
  const { employeeId, entryType, amount, note } = createLedgerBodySchema.parse(req.body);
  const entry = await prisma.salaryLedger.create({
    data: { employeeId, entryType, amount, note }
  });
  queueNotifyFinanceUpdated({
    employeeId,
    entryType,
    amount: entry.amount.toString(),
    note: entry.note
  });
  res.status(201).json(entry);
}));
