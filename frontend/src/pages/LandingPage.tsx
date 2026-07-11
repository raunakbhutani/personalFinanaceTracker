import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  PiggyBank,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Track Every Transaction",
    description:
      "Log income and expenses with categories, descriptions, and dates. Your full financial history in one place.",
  },
  {
    icon: PiggyBank,
    title: "Smart Budget Management",
    description:
      "Set monthly spending limits per category and get real-time progress tracking so you never overspend.",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics",
    description:
      "Understand your money with monthly trend charts, category breakdowns, and budget vs. actual comparisons.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is protected with encrypted passwords and JWT authentication. Only you can access your finances.",
  },
];

const highlights = [
  "Unlimited transactions",
  "Custom categories",
  "Monthly budget tracking",
  "Income & expense reports",
  "Responsive on all devices",
  "Free to use",
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/">
            <Logo size="sm" />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-background dark:from-gray-950 dark:via-gray-900 dark:to-background" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Take control of your finances
            </div>

            <div className="mb-8 flex justify-center">
              <Logo size="lg" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-heading">
              Manage your money{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                with confidence
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              FinTrack helps you track spending, set budgets, and visualize your financial
              health — all in a beautiful, easy-to-use dashboard.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto px-8" asChild>
                <Link to="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Set up in under a minute
            </p>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border bg-background/60 p-2 shadow-2xl shadow-primary/10 backdrop-blur-sm">
              <div className="rounded-xl border bg-muted/50 p-6 sm:p-8">
                <div className="grid gap-4 sm:grid-cols-4">
                  {[
                    { label: "Total Income", value: "$4,250", color: "text-green-600" },
                    { label: "Total Expenses", value: "$2,180", color: "text-red-600" },
                    { label: "Net Balance", value: "$2,070", color: "text-green-600" },
                    { label: "Remaining Budget", value: "$820", color: "text-primary" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className={`mt-1 text-xl font-bold ${metric.color}`}>{metric.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex h-36 items-end gap-2 rounded-lg border bg-card p-4 shadow-sm">
                    {[40, 65, 45, 80, 55, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-red-400/80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex h-36 items-center justify-center rounded-lg border bg-card p-4 shadow-sm">
                    <div className="relative h-24 w-24 rounded-full border-[12px] border-orange-400 border-r-green-400 border-b-blue-400 border-l-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay on budget
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to make personal finance simple and stress-free.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-0 shadow-md transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights + CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <TrendingUp className="h-4 w-4" />
                Built for everyday use
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Start tracking in minutes, not hours
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you&apos;re managing a side hustle or your household budget, FinTrack
                gives you the clarity you need to make smarter financial decisions.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary to-indigo-600 p-8 text-primary-foreground shadow-xl sm:p-10">
              <h3 className="text-2xl font-bold">Ready to take control?</h3>
              <p className="mt-3 text-primary-foreground/80">
                Join FinTrack today and build healthier financial habits with a dashboard
                you&apos;ll actually enjoy using.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link to="/signup">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground text-center">
            Made by Raunak Bhutani
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
