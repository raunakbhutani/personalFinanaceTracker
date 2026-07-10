import { Response } from "express";
import { AuthRequest } from "../types";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, toNumber } from "../utils/response";
import { paramId } from "../utils/param";

// GET /api/budgets - List budgets for a given month/year
export async function getBudgets(req: AuthRequest, res: Response): Promise<void> {
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const budgets = await prisma.budget.findMany({
    where: { userId: req.user!.id, month, year },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    where: { userId: req.user!.id, type: "EXPENSE" },
  });

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const expenses = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId: req.user!.id,
      type: "EXPENSE",
      date: { gte: start, lte: end },
    },
    _sum: { amount: true },
  });

  const spentMap = new Map(
    expenses.map((e) => [e.categoryId, toNumber(e._sum.amount || 0)])
  );

  const result = budgets.map((b) => {
    const category = categoryMap.get(b.categoryId);
    const budgetAmount = toNumber(b.amount);
    const spentAmount = spentMap.get(b.categoryId) || 0;
    return {
      ...b,
      amount: budgetAmount,
      categoryName: category?.name || "Unknown",
      categoryColor: category?.color || "#6b7280",
      spentAmount,
      remaining: budgetAmount - spentAmount,
      percentUsed: budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0,
    };
  });

  sendSuccess(res, result);
}

// POST /api/budgets - Set or update a monthly budget for a category
export async function upsertBudget(req: AuthRequest, res: Response): Promise<void> {
  const { amount, month, year, categoryId } = req.body;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: req.user!.id, type: "EXPENSE" },
  });

  if (!category) {
    sendError(res, "Expense category not found", 404);
    return;
  }

  const budget = await prisma.budget.upsert({
    where: {
      userId_categoryId_month_year: {
        userId: req.user!.id,
        categoryId,
        month,
        year,
      },
    },
    update: { amount },
    create: { amount, month, year, categoryId, userId: req.user!.id },
  });

  sendSuccess(res, { ...budget, amount: toNumber(budget.amount) }, "Budget saved");
}

// DELETE /api/budgets/:id - Delete a budget
export async function deleteBudget(req: AuthRequest, res: Response): Promise<void> {
  const budget = await prisma.budget.findFirst({
    where: { id: paramId(req.params.id), userId: req.user!.id },
  });

  if (!budget) {
    sendError(res, "Budget not found", 404);
    return;
  }

  await prisma.budget.delete({ where: { id: paramId(req.params.id) } });
  sendSuccess(res, null, "Budget deleted");
}
