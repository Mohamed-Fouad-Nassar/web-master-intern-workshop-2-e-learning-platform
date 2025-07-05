import { Outlet } from "react-router";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block border-r">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
