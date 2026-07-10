import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string().optional(),
});

export const updateTransactionSchema = transactionSchema.partial();

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
});

export const budgetSchema = z.object({
  amount: z.number().positive("Budget amount must be positive"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  categoryId: z.string().min(1, "Category is required"),
});

export const transactionQuerySchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
});

export const budgetQuerySchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export const analyticsQuerySchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});
