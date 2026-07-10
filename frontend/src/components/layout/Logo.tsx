import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "h-5 w-5", box: "h-8 w-8", text: "text-base" },
  md: { icon: "h-6 w-6", box: "h-10 w-10", text: "text-xl" },
  lg: { icon: "h-8 w-8", box: "h-14 w-14", text: "text-2xl" },
};

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25",
          s.box
        )}
      >
        <Wallet className={cn("text-primary-foreground", s.icon)} />
      </div>
      {showText && (
        <div>
          <span className={cn("font-bold tracking-tight text-foreground", s.text)}>
            FinTrack
          </span>
          {size === "lg" && (
            <p className="text-sm text-muted-foreground">Personal Finance Tracker</p>
          )}
        </div>
      )}
    </div>
  );
}
