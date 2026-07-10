import { Response } from "express";
import { AuthRequest } from "../types";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError } from "../utils/response";
import { paramId } from "../utils/param";

// GET /api/categories - List all categories for the authenticated user
export async function getCategories(req: AuthRequest, res: Response): Promise<void> {
  const { type } = req.query as { type?: string };

  const where: Record<string, unknown> = { userId: req.user!.id };
  if (type) where.type = type;

  const categories = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
  });

  sendSuccess(res, categories);
}

// POST /api/categories - Create a custom category
export async function createCategory(req: AuthRequest, res: Response): Promise<void> {
  const { name, type, color } = req.body;

  const existing = await prisma.category.findFirst({
    where: { userId: req.user!.id, name, type },
  });

  if (existing) {
    sendError(res, "Category already exists", 409);
    return;
  }

  const category = await prisma.category.create({
    data: { name, type, color: color || "#6366f1", userId: req.user!.id },
  });

  sendSuccess(res, category, "Category created", 201);
}

// DELETE /api/categories/:id - Delete a category
export async function deleteCategory(req: AuthRequest, res: Response): Promise<void> {
  const category = await prisma.category.findFirst({
    where: { id: paramId(req.params.id), userId: req.user!.id },
    include: { _count: { select: { transactions: true } } },
  });

  if (!category) {
    sendError(res, "Category not found", 404);
    return;
  }

  if (category._count.transactions > 0) {
    sendError(res, "Cannot delete category with existing transactions", 400);
    return;
  }

  await prisma.category.delete({ where: { id: paramId(req.params.id) } });
  sendSuccess(res, null, "Category deleted");
}
