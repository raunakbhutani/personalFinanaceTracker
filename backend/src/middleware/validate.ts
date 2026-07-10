import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { sendError } from "../utils/response";

// Middleware factory: validates request body against a Zod schema
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => e.message).join(", ");
        sendError(res, messages, 400);
        return;
      }
      sendError(res, "Validation failed", 400);
    }
  };
}

// Middleware factory: validates query parameters against a Zod schema
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => e.message).join(", ");
        sendError(res, messages, 400);
        return;
      }
      sendError(res, "Validation failed", 400);
    }
  };
}
