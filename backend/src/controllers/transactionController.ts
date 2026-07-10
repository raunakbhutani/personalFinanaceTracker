import { Response } from "express";
import { AuthRequest } from "../types";
import { prisma } from "../utils/prisma";
import { sendSuccess, sendError, toNumber } from "../utils/response";
import { paramId } from "../utils/param";

// GET /api/transactions - List all transactions for the authenticated user
export async function getTransactions(req: AuthRequest, res: Response): Promise<void> {
  const { type, categoryId, month, year } = req.query as {
    type?: string;
    categoryId?: string;
    month?: string;
    year?: string;
  };

  const where: Record<string, unknown> = { userId: req.user!.id };

  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;

  if (month && year) {
    const m = parseInt(month);
    const y = parseInt(year);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { category: { select: { id: true, name: true, color: true, type: true } } },
    orderBy: { date: "desc" },
  });

  const formatted = transactions.map((t) => ({
    ...t,
    amount: toNumber(t.amount),
  }));

  sendSuccess(res, formatted);
}

// GET /api/transactions/:id - Get a single transaction
export async function getTransaction(req: AuthRequest, res: Response): Promise<void> {
  const transaction = await prisma.transaction.findFirst({
    where: { id: paramId(req.params.id), userId: req.user!.id },
    include: { category: true },
  });

  if (!transaction) {
    sendError(res, "Transaction not found", 404);
    return;
  }

  sendSuccess(res, { ...transaction, amount: toNumber(transaction.amount) });
}

// POST /api/transactions - Create a new transaction
export async function createTransaction(req: AuthRequest, res: Response): Promise<void> {
  const { amount, type, categoryId, description, date } = req.body;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: req.user!.id },
  });

  if (!category) {
    sendError(res, "Category not found", 404);
    return;
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      categoryId,
      description,
      date: date ? new Date(date) : new Date(),
      userId: req.user!.id,
    },
    include: { category: { select: { id: true, name: true, color: true, type: true } } },
  });

  sendSuccess(res, { ...transaction, amount: toNumber(transaction.amount) }, "Transaction created", 201);
}

// PUT /api/transactions/:id - Update an existing transaction
export async function updateTransaction(req: AuthRequest, res: Response): Promise<void> {
  const id = paramId(req.params.id);
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: req.user!.id },
  });

  if (!existing) {
    sendError(res, "Transaction not found", 404);
    return;
  }

  const { amount, type, categoryId, description, date } = req.body;

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user!.id },
    });
    if (!category) {
      sendError(res, "Category not found", 404);
      return;
    }
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...(amount !== undefined && { amount }),
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(description !== undefined && { description }),
      ...(date && { date: new Date(date) }),
    },
    include: { category: { select: { id: true, name: true, color: true, type: true } } },
  });

  sendSuccess(res, { ...transaction, amount: toNumber(transaction.amount) }, "Transaction updated");
}

// DELETE /api/transactions/:id - Delete a transaction
export async function deleteTransaction(req: AuthRequest, res: Response): Promise<void> {
  const id = paramId(req.params.id);
  const existing = await prisma.transaction.findFirst({
    where: { id, userId: req.user!.id },
  });

  if (!existing) {
    sendError(res, "Transaction not found", 404);
    return;
  }

  await prisma.transaction.delete({ where: { id } });
  sendSuccess(res, null, "Transaction deleted");
}
