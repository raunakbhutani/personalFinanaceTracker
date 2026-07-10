import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryApi } from "@/api";
import type { Category, BudgetFormData } from "@/types";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: BudgetFormData) => Promise<void>;
  month: number;
  year: number;
}

export function BudgetDialog({ open, onOpenChange, onSave, month, year }: BudgetDialogProps) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      categoryApi.getAll("EXPENSE").then(({ data }) => {
        if (data.success && data.data) setCategories(data.data);
      });
      setAmount("");
      setCategoryId("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave({
        amount: parseFloat(amount),
        month,
        year,
        categoryId,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || "Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-heading">Set Monthly Budget</DialogTitle>
          <DialogDescription>
            Set a spending limit for {monthName} {year}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 mt-2">
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          <div className="space-y-4">
            <Label className="block text-base font-medium">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="cursor-pointer h-11">
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="block text-base font-medium">Budget Amount</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !categoryId}>
              {loading ? "Saving..." : "Set Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
