import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { budgetApi } from "@/api";
import { BudgetDialog } from "@/components/budgets/BudgetDialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget, BudgetFormData } from "@/types";
import { formatCurrency } from "@/lib/utils";

// BudgetsPage: manage monthly budgets. Uses confirm dialog for deletions
// so we avoid browser alerts and keep the design consistent. Refreshes
// shared analytics when budgets change.
export function BudgetsPage() {
  const { fetchAnalytics } = useAnalytics();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await budgetApi.getAll(month, year);
      if (data.success && data.data) setBudgets(data.data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleSave = async (formData: BudgetFormData) => {
    await budgetApi.upsert(formData);
    fetchBudgets();
    // Refresh analytics so dashboard updates with new budget data
    await fetchAnalytics(month, year);
  };

  const handleDelete = async (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await budgetApi.delete(pendingDeleteId);
    setPendingDeleteId(null);
    setConfirmOpen(false);
    fetchBudgets();
    // Refresh analytics so dashboard updates with new budget data
    await fetchAnalytics(month, year);
  };

  const changeMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    setMonth(newMonth);
    setYear(newYear);
  };

  const monthLabel = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spentAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Set and track monthly spending limits</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Set Budget
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-lg font-medium min-w-[180px] text-center">{monthLabel}</span>
        <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalBudget - totalSpent >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalBudget - totalSpent)}
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="flex h-48 items-center justify-center text-muted-foreground">
            No budgets set for this month. Click &quot;Set Budget&quot; to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const percent = budget.percentUsed || 0;
            const isOver = percent > 100;
            return (
              <Card key={budget.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: budget.categoryColor }}
                    />
                    <CardTitle className="text-base">{budget.categoryName}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(budget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatCurrency(budget.spentAmount || 0)} of {formatCurrency(budget.amount)}
                    </span>
                    <span className={isOver ? "text-red-600 font-medium" : "text-muted-foreground"}>
                      {percent}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(percent, 100)}
                    indicatorClassName={isOver ? "bg-red-500" : percent > 80 ? "bg-yellow-500" : "bg-primary"}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(budget.remaining || 0)} remaining
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BudgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        month={month}
        year={year}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete budget"
        description="This will remove the budget for this category. Continue?"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
