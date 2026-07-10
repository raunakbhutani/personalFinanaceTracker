import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { analyticsApi } from "@/api";
import type { AnalyticsSummary } from "@/types";

interface AnalyticsContextType {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  fetchAnalytics: (month?: number, year?: number) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// AnalyticsProvider: shared context for analytics data. When transactions
// or budgets change on any page, we fetch fresh analytics so that the
// dashboard and all subscribed components (charts, budget cards) update
// efficiently. Only the subscribed components re-render, not the full page.
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch analytics for the given month/year. If not provided, uses current month/year.
  const fetchAnalytics = useCallback(async (m?: number, y?: number) => {
    const fetchMonth = m ?? month;
    const fetchYear = y ?? year;
    setLoading(true);
    try {
      const { data } = await analyticsApi.get(fetchMonth, fetchYear);
      if (data.success && data.data) {
        setAnalytics(data.data);
        setMonth(fetchMonth);
        setYear(fetchYear);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        loading,
        month,
        year,
        setMonth,
        setYear,
        fetchAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use the AnalyticsContext. Throws if called outside AnalyticsProvider.
export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
}
