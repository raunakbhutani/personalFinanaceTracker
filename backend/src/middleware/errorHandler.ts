import { Response, NextFunction } from "express";
import { sendError } from "../utils/response";

// Global error handler middleware
export function errorHandler(
  err: Error,
  _req: unknown,
  res: Response,
  _next: NextFunction
): void {
  console.error("Unhandled error:", err.message);
  sendError(res, "Internal server error", 500);
}
