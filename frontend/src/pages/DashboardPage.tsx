import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { transactionApi } from "@/api";
import { DashboardMetrics } from "@/components/dashboard/MetricCard";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { BudgetByCategory } from "@/components/dashboard/BudgetByCategory";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import type { Transaction, TransactionFormData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// DashboardPage: uses shared AnalyticsContext to fetch analytics and render
// the dashboard widgets (metrics, monthly trend, category chart, budgets and
// recent transactions). When transactions are added/edited/deleted on any page,
// the context triggers a refresh and only subscribed components re-render.
export function DashboardPage() {
  const { user } = useAuth();
  const { analytics, loading, month, year, fetchAnalytics } = useAnalytics();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Fetch analytics on component mount
  useEffect(() => {
    fetchAnalytics(month, year);
  }, [month, year, fetchAnalytics]);

  // Fetch recent transactions
  const fetchRecentTransactions = useCallback(async () => {
    try {
      const { data } = await transactionApi.getAll();
      if (data.success && data.data) {
        setRecentTransactions(data.data.slice(0, 10));
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  }, []);

  useEffect(() => {
    fetchRecentTransactions();
  }, [fetchRecentTransactions]);

  const handleSave = async (data: TransactionFormData) => {
    if (editingTransaction) {
      await transactionApi.update(editingTransaction.id, data);
    } else {
      await transactionApi.create(data);
    }
    // Refresh analytics after a transaction is created/updated
    await fetchAnalytics(month, year);
    await fetchRecentTransactions();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  // Open confirm dialog when a delete is requested. Actual deletion
  // happens in `handleConfirmDelete` after the user confirms.
  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await transactionApi.delete(pendingDeleteId);
    setPendingDeleteId(null);
    setConfirmOpen(false);
    // Refresh analytics after deletion
    await fetchAnalytics(month, year);
    await fetchRecentTransactions();
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingTransaction(null);
  };

  const changeMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    fetchAnalytics(newMonth, newYear);
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  if (loading && !analytics) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-base font-medium min-w-[180px] text-center font-heading">{monthLabel}</span>
        <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {analytics && (
        <DashboardMetrics
          totalIncome={analytics.totalIncome}
          totalExpenses={analytics.totalExpenses}
          netBalance={analytics.netBalance}
          remainingBudget={analytics.remainingBudget}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {analytics && <MonthlyTrendChart data={analytics.monthlyTrend} />}
        {analytics && (
          <CategoryChart
            key={analytics.categoryBreakdown.map((c) => `${c.categoryId}-${c.amount}`).join("|")}
            data={analytics.categoryBreakdown}
          />
        )}
      </div>

      {analytics && analytics.budgetComparison.length > 0 && (
        <BudgetByCategory budgets={analytics.budgetComparison} />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-heading">Recent Transactions</CardTitle>
          <Button variant="link" asChild className="text-sm">
            <Link to="/transactions">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={recentTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        transaction={editingTransaction}
        onSave={handleSave}
      />

      {/* Reusable confirm dialog used when deleting transactions */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete transaction"
        description="This action cannot be undone. Do you want to delete this transaction?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
