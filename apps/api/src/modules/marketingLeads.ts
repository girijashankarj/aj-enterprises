import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../lib/http";
import { requireAuth, requireRole } from "../middleware/auth";

export const marketingRouter = Router();

marketingRouter.use(requireAuth);

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

marketingRouter.get(
  "/leads",
  requireRole(["ADMIN", "MANAGER"]),
  asyncHandler(async (req, res) => {
    const { page, limit } = listQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.publicLead.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.publicLead.count()
    ]);

    res.json({ items, page, limit, total });
  })
);
