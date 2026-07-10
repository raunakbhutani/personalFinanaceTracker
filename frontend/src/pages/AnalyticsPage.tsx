import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { analyticsApi } from "@/api";
import { DashboardMetrics } from "@/components/dashboard/MetricCard";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import type { AnalyticsSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await analyticsApi.get(month, year);
      if (data.success && data.data) setAnalytics(data.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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

  if (loading) {
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
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Financial reports and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[180px] text-center">{monthLabel}</span>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {analytics && (
        <>
          <DashboardMetrics
            totalIncome={analytics.totalIncome}
            totalExpenses={analytics.totalExpenses}
            netBalance={analytics.netBalance}
            remainingBudget={analytics.remainingBudget}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyTrendChart data={analytics.monthlyTrend} />
            <CategoryChart
              key={analytics.categoryBreakdown.map((c) => `${c.categoryId}-${c.amount}`).join("|")}
              data={analytics.categoryBreakdown}
            />
          </div>

          {analytics.budgetComparison.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Budget vs Actual Spending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.budgetComparison.map((item) => {
                  const isOver = item.percentUsed > 100;
                  return (
                    <div key={item.categoryId} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.categoryName}</span>
                        <span>
                          {formatCurrency(item.spentAmount)} / {formatCurrency(item.budgetAmount)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(item.percentUsed, 100)}
                        indicatorClassName={isOver ? "bg-red-500" : item.percentUsed > 80 ? "bg-yellow-500" : "bg-primary"}
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
