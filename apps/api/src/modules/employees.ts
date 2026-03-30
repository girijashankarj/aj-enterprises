import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler, validateBody, validateQuery } from "../lib/http";
import { requireAuth, requireRole } from "../middleware/auth";

export const employeesRouter = Router();

employeesRouter.use(requireAuth);

const listEmployeesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

const createEmployeeBodySchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  salaryBase: z.coerce.number().nonnegative(),
  phone: z.string().min(7).max(20).optional()
});

employeesRouter.get("/", requireRole(["ADMIN", "MANAGER"]), validateQuery(listEmployeesQuerySchema), asyncHandler(async (req, res) => {
  const { page, limit } = listEmployeesQuerySchema.parse(req.query);
  const employees = await prisma.user.findMany({
    where: { role: "EMPLOYEE" },
    include: { employeeProfile: true },
    skip: (page - 1) * limit,
    take: limit
  });
  res.json({ items: employees, page, limit });
}));

employeesRouter.post("/", requireRole(["ADMIN", "MANAGER"]), validateBody(createEmployeeBodySchema), asyncHandler(async (req, res) => {
  const { email, fullName, salaryBase, phone } = createEmployeeBodySchema.parse(req.body);

  const employee = await prisma.user.create({
    data: {
      email,
      fullName,
      role: "EMPLOYEE",
      employeeProfile: {
        create: {
          salaryBase,
          phone
        }
      }
    },
    include: { employeeProfile: true }
  });

  res.status(201).json(employee);
}));
