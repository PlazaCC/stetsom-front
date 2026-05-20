"use client";

import QueryProvider from "@/components/query-provider";
import { usePathname } from "next/navigation";
import "./admin.css";
import { AdminSidebar } from "./_components/admin-sidebar";

function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background px-11.75 py-7.25">
        {children}
      </main>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return isLoginPage ? <>{children}</> : <PanelLayout>{children}</PanelLayout>;
}

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <div className="cms">
        <AdminShell>{children}</AdminShell>
      </div>
    </QueryProvider>
  );
}
