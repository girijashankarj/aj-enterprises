import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../lib/http";

export type AuthenticatedUser = {
  id: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  email: string;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string; role: AuthenticatedUser["role"]; email: string };
    req.user = {
      id: decoded.sub,
      role: decoded.role,
      email: decoded.email
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole =
  (roles: AuthenticatedUser["role"][]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, "Unauthorized", "UNAUTHORIZED"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Forbidden", "FORBIDDEN"));
    }
    next();
  };
