import { Response } from "express";
import { ApiResponse } from "../types";

// Helper to send consistent API responses
export function sendSuccess<T>(res: Response, data: T, message?: string, status = 200) {
  const response: ApiResponse<T> = { success: true, data, message };
  res.status(status).json(response);
}

export function sendError(res: Response, error: string, status = 400) {
  const response: ApiResponse = { success: false, error };
  res.status(status).json(response);
}

// Convert Prisma Decimal to number for JSON serialization
export function toNumber(value: { toNumber(): number } | number): number {
  return typeof value === "number" ? value : value.toNumber();
}
