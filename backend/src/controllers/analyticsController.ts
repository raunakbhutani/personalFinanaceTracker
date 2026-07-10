import { Response } from "express";
import { AuthRequest, AnalyticsSummary } from "../types";
import { prisma } from "../utils/prisma";
import { sendSuccess, toNumber } from "../utils/response";

// GET /api/analytics - Dashboard analytics and reports
export async function getAnalytics(req: AuthRequest, res: Response): Promise<void> {
  const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const userId = req.user!.id;

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { category: true },
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryMap = new Map<string, { name: string; color: string; amount: number }>();

  for (const t of transactions) {
    const amount = toNumber(t.amount);
    if (t.type === "INCOME") {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
      const existing = categoryMap.get(t.categoryId) || {
        name: t.category.name,
        color: t.category.color,
        amount: 0,
      };
      existing.amount += amount;
      categoryMap.set(t.categoryId, existing);
    }
  }

  const budgets = await prisma.budget.findMany({
    where: { userId, month, year },
  });

  const totalBudget = budgets.reduce((sum, b) => sum + toNumber(b.amount), 0);
  const remainingBudget = totalBudget - totalExpenses;

  const monthlyTrend = await getMonthlyTrend(userId, year);

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([categoryId, data]) => ({
    categoryId,
    categoryName: data.name,
    color: data.color,
    amount: data.amount,
  }));

  const categories = await prisma.category.findMany({
    where: { userId, type: "EXPENSE" },
  });
  const categoryNameMap = new Map(categories.map((c) => [c.id, c.name]));

  const budgetComparison = budgets.map((b) => {
    const budgetAmount = toNumber(b.amount);
    const catData = categoryMap.get(b.categoryId);
    const spentAmount = catData?.amount || 0;
    return {
      categoryId: b.categoryId,
      categoryName: categoryNameMap.get(b.categoryId) || "Unknown",
      budgetAmount,
      spentAmount,
      remaining: budgetAmount - spentAmount,
      percentUsed: budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0,
    };
  });

  const analytics: AnalyticsSummary = {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    remainingBudget,
    monthlyTrend,
    categoryBreakdown,
    budgetComparison,
  };

  sendSuccess(res, analytics);
}

// Build last 12 months income/expense trend data (includes older transactions like Nov 2025)
async function getMonthlyTrend(userId: string, _year: number) {
  const months: { month: string; income: number; expenses: number }[] = [];
  const now = new Date();
  const currentMonth = now.getMonth();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), currentMonth - i, 1);
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);

    const txs = await prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
    });

    let income = 0;
    let expenses = 0;
    for (const t of txs) {
      const amount = toNumber(t.amount);
      if (t.type === "INCOME") income += amount;
      else expenses += amount;
    }

    const monthLabel = d.toLocaleString("default", { month: "short", year: "2-digit" });
    months.push({ month: monthLabel, income, expenses });
  }

  return months;
}
