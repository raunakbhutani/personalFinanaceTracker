// TransactionTable: responsible for rendering a list of transactions in a
// tabular format. Rows provide edit and delete actions which are delegated
// to parent components via callbacks (`onEdit`, `onDelete`). Formatting
// helpers are used for dates and currency display.
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function TransactionTable({
  transactions,
  onEdit,
  onDelete,
  loading,
}: TransactionTableProps) {
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        No transactions found. Add your first transaction to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="whitespace-nowrap">{formatDate(tx.date)}</TableCell>
            <TableCell className="max-w-[200px] truncate">
              {tx.description || "—"}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: tx.category.color }}
                />
                {tx.category.name}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={tx.type === "INCOME" ? "income" : "expense"}>
                {tx.type === "INCOME" ? "Income" : "Expense"}
              </Badge>
            </TableCell>
            <TableCell
              className={`text-right font-medium ${
                tx.type === "INCOME" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.type === "INCOME" ? "+" : "-"}
              {formatCurrency(tx.amount)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(tx)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(tx.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
