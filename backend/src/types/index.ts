import { Request } from "express";

// Extended Express Request with authenticated user payload from JWT
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// API response wrapper for consistent JSON responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard analytics summary
export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  remainingBudget: number;
  monthlyTrend: MonthlyTrendItem[];
  categoryBreakdown: CategoryBreakdownItem[];
  budgetComparison: BudgetComparisonItem[];
}

export interface MonthlyTrendItem {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
}

export interface BudgetComparisonItem {
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spentAmount: number;
  remaining: number;
  percentUsed: number;
}
