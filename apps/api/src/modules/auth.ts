import { OAuth2Client } from "google-auth-library";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";
import { AppError, asyncHandler, validateBody } from "../lib/http";

export const authRouter = Router();

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

const googleTokenBodySchema = z.object({
  idToken: z.string().min(1),
  role: z.nativeEnum(UserRole).optional()
});

authRouter.post("/google/token", validateBody(googleTokenBodySchema), asyncHandler(async (req, res) => {
  const { idToken, role } = googleTokenBodySchema.parse(req.body);

  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ message: "Google auth is not configured." });
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new AppError(401, "Invalid Google token payload.", "INVALID_GOOGLE_TOKEN");
  }

  const user = await prisma.user.upsert({
    where: { email: payload.email },
    update: {
      fullName: payload.name ?? payload.email,
      googleId: payload.sub
    },
    create: {
      email: payload.email,
      fullName: payload.name ?? payload.email,
      googleId: payload.sub,
      role: role ?? UserRole.MANAGER
    }
  });

  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.JWT_SECRET, {
    expiresIn: "4h"
  });

  res.json({ token, user });
}));

authRouter.get("/google/start", (_req, res) => {
  res.json({
    message: "Frontend should initiate Google Sign-In and submit idToken to /google/token"
  });
});
