import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "income" | "expense" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "income" && "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        variant === "expense" && "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        variant === "outline" && "text-foreground",
        className
      )}
      {...props}
    />
  );
}
