import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError, asyncHandler, validateBody, validateQuery } from "../lib/http";
import { requireAuth, requireRole } from "../middleware/auth";

export const attendanceRouter = Router();

attendanceRouter.use(requireAuth);

/** Current user's employee profile id (for marking own attendance on the client). */
attendanceRouter.get("/me-profile", asyncHandler(async (req, res) => {
  const id = await getEmployeeProfileIdForUser(req.user!.id);
  res.json({ employeeProfileId: id });
}));

/** Normalize to UTC midnight for the calendar day of the parsed instant (consistent unique key). */
function normalizeAttendanceDate(input: string): Date {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(400, "Invalid attendanceDate", "VALIDATION_ERROR");
  }
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

async function getEmployeeProfileIdForUser(userId: string): Promise<string | null> {
  const profile = await prisma.employeeProfile.findUnique({
    where: { userId },
    select: { id: true }
  });
  return profile?.id ?? null;
}

const listQuerySchema = z.object({
  fromDate: z.string().min(1),
  toDate: z.string().min(1),
  employeeProfileId: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

const upsertBodySchema = z.object({
  employeeProfileId: z.string().min(1),
  attendanceDate: z.string().min(1),
  isPresent: z.boolean(),
  notes: z.string().max(500).optional()
});

const attendanceInclude = {
  employeeProfile: {
    include: {
      user: { select: { id: true, fullName: true, email: true } }
    }
  }
} as const;

attendanceRouter.get("/", validateQuery(listQuerySchema), asyncHandler(async (req, res) => {
  const { fromDate, toDate, employeeProfileId: filterProfileId, page, limit } = listQuerySchema.parse(req.query);
  const user = req.user!;

  const from = normalizeAttendanceDate(fromDate);
  const to = normalizeAttendanceDate(toDate);
  if (from.getTime() > to.getTime()) {
    throw new AppError(400, "fromDate must be on or before toDate", "VALIDATION_ERROR");
  }

  let where: Prisma.AttendanceWhereInput = {
    attendanceDate: { gte: from, lte: to }
  };

  if (user.role === "EMPLOYEE") {
    const ownProfileId = await getEmployeeProfileIdForUser(user.id);
    if (!ownProfileId) {
      throw new AppError(403, "No employee profile for this user", "FORBIDDEN");
    }
    if (filterProfileId && filterProfileId !== ownProfileId) {
      throw new AppError(403, "Cannot view other employees' attendance", "FORBIDDEN");
    }
    where = { ...where, employeeProfileId: ownProfileId };
  } else {
    if (filterProfileId) {
      where = { ...where, employeeProfileId: filterProfileId };
    }
  }

  const [items, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: attendanceInclude,
      orderBy: [{ attendanceDate: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.attendance.count({ where })
  ]);

  res.json({ items, page, limit, total });
}));

attendanceRouter.post(
  "/",
  requireRole(["ADMIN", "MANAGER", "EMPLOYEE"]),
  validateBody(upsertBodySchema),
  asyncHandler(async (req, res) => {
    const { employeeProfileId, attendanceDate, isPresent, notes } = upsertBodySchema.parse(req.body);
    const user = req.user!;

    const day = normalizeAttendanceDate(attendanceDate);

    if (user.role === "EMPLOYEE") {
      const ownProfileId = await getEmployeeProfileIdForUser(user.id);
      if (!ownProfileId || employeeProfileId !== ownProfileId) {
        throw new AppError(403, "You can only record attendance for yourself", "FORBIDDEN");
      }
    }

    try {
      const row = await prisma.attendance.upsert({
        where: {
          employeeProfileId_attendanceDate: {
            employeeProfileId,
            attendanceDate: day
          }
        },
        create: {
          employeeProfileId,
          attendanceDate: day,
          isPresent,
          notes: notes ?? null
        },
        update: {
          isPresent,
          notes: notes ?? null
        },
        include: attendanceInclude
      });
      res.json(row);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new AppError(409, "Attendance already exists for this day", "CONFLICT");
      }
      throw e;
    }
  })
);
