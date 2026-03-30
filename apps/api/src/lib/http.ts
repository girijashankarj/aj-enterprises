import { RequestHandler } from "express";
import { z } from "zod";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = "BAD_REQUEST"
  ) {
    super(message);
  }
}

export const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

const formatZodIssues = (error: z.ZodError) =>
  error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));

export const validateBody = <T extends z.ZodTypeAny>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new AppError(400, "Invalid request body", "VALIDATION_ERROR"));
    }
    req.body = parsed.data;
    next();
  };
};

export const validateQuery = <T extends z.ZodTypeAny>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return next(new AppError(400, "Invalid query params", "VALIDATION_ERROR"));
    }
    req.query = parsed.data as never;
    next();
  };
};

export const validateParams = <T extends z.ZodTypeAny>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return next(new AppError(400, "Invalid route params", "VALIDATION_ERROR"));
    }
    req.params = parsed.data as never;
    next();
  };
};

export const getValidationDetails = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return formatZodIssues(error);
  }
  return undefined;
};
