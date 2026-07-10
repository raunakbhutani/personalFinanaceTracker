// Core TypeScript interfaces for the FinTrack frontend. These types define
// the shape of users, transactions, budgets, analytics, and form data.

export type TransactionType = "INCOME" | "EXPENSE";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string | null;
  date: string;
  categoryId: string;
  category: Pick<Category, "id" | "name" | "color" | "type">;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  categoryName?: string;
  categoryColor?: string;
  spentAmount?: number;
  remaining?: number;
  percentUsed?: number;
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

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  remainingBudget: number;
  monthlyTrend: MonthlyTrendItem[];
  categoryBreakdown: CategoryBreakdownItem[];
  budgetComparison: BudgetComparisonItem[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TransactionFormData {
  amount: number;
  type: TransactionType;
  categoryId: string;
  description?: string;
  date: string;
}

export interface BudgetFormData {
  amount: number;
  month: number;
  year: number;
  categoryId: string;
}
