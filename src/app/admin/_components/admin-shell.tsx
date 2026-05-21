"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";

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

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return isLoginPage ? <>{children}</> : <PanelLayout>{children}</PanelLayout>;
}
