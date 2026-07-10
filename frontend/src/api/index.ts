import api from "./client";
import type {
  ApiResponse,
  AuthResponse,
  User,
  Transaction,
  Category,
  Budget,
  AnalyticsSummary,
  TransactionFormData,
  BudgetFormData,
} from "@/types";

export const authApi = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", data),

  getMe: () => api.get<ApiResponse<User>>("/auth/me"),
};

export const transactionApi = {
  getAll: (params?: { type?: string; month?: number; year?: number }) =>
    api.get<ApiResponse<Transaction[]>>("/transactions", { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Transaction>>(`/transactions/${id}`),

  create: (data: TransactionFormData) =>
    api.post<ApiResponse<Transaction>>("/transactions", data),

  update: (id: string, data: Partial<TransactionFormData>) =>
    api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/transactions/${id}`),
};

export const categoryApi = {
  getAll: (type?: string) =>
    api.get<ApiResponse<Category[]>>("/categories", { params: { type } }),

  create: (data: { name: string; type: string; color?: string }) =>
    api.post<ApiResponse<Category>>("/categories", data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/categories/${id}`),
};

export const budgetApi = {
  getAll: (month?: number, year?: number) =>
    api.get<ApiResponse<Budget[]>>("/budgets", { params: { month, year } }),

  upsert: (data: BudgetFormData) =>
    api.post<ApiResponse<Budget>>("/budgets", data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/budgets/${id}`),
};

export const analyticsApi = {
  get: (month?: number, year?: number) =>
    api.get<ApiResponse<AnalyticsSummary>>("/analytics", { params: { month, year } }),
};
