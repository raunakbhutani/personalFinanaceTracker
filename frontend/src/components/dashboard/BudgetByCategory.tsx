// BudgetByCategory: shows budget progress for each category. Receives an
// array of budget comparison items from analytics and displays progress
// bars, amounts and remaining values for the active month.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BudgetComparisonItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface BudgetByCategoryProps {
  budgets: BudgetComparisonItem[];
}

export function BudgetByCategory({ budgets }: BudgetByCategoryProps) {
  if (budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Budget by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">
            No budgets set for this month. Head to Budgets to set category limits.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading">Budget by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {budgets.map((item) => {
          const isOver = item.percentUsed > 100;
          return (
            <div key={item.categoryId} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-sm">{item.categoryName}</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatCurrency(item.spentAmount)} / {formatCurrency(item.budgetAmount)}
                </span>
              </div>
              <Progress
                value={Math.min(item.percentUsed, 100)}
                indicatorClassName={
                  isOver ? "bg-red-500" : item.percentUsed > 80 ? "bg-yellow-500" : "bg-primary"
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.percentUsed}% used</span>
                <span className={item.remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {formatCurrency(item.remaining)} remaining
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
