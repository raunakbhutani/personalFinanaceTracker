import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Sidebar />
      <div className="flex-grow flex flex-col lg:pl-64">
        <main className="flex-grow p-4 pt-16 lg:p-8 lg:pt-8 pb-4">
          <Outlet />
        </main>
        <footer className="py-4 border-t text-center bg-background">
          <p className="text-sm text-muted-foreground">
            Made by Raunak Bhutani
          </p>
        </footer>
      </div>
    </div>
  );
}
