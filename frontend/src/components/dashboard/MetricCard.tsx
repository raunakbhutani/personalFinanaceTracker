import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricCard({ title, value, icon, trend = "neutral", className }: MetricCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold text-foreground font-heading">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-2xl font-bold",
            trend === "up" && "text-green-600 dark:text-green-400",
            trend === "down" && "text-red-600 dark:text-red-400"
          )}
        >
          {formatCurrency(value)}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardMetricsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  remainingBudget: number;
}

export function DashboardMetrics({
  totalIncome,
  totalExpenses,
  netBalance,
  remainingBudget,
}: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Income"
        value={totalIncome}
        icon={<TrendingUp className="h-4 w-4" />}
        trend="up"
      />
      <MetricCard
        title="Total Expenses"
        value={totalExpenses}
        icon={<TrendingDown className="h-4 w-4" />}
        trend="down"
      />
      <MetricCard
        title="Net Balance"
        value={netBalance}
        icon={<Wallet className="h-4 w-4" />}
        trend={netBalance >= 0 ? "up" : "down"}
      />
      <MetricCard
        title="Remaining Budget"
        value={remainingBudget}
        icon={<PiggyBank className="h-4 w-4" />}
        trend={remainingBudget >= 0 ? "up" : "down"}
      />
    </div>
  );
}
