"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";

function PanelLayout({ children }: { children: React.ReactNode }) {
  // Mantine AppShell pattern: the shell is locked to the viewport height and the
  // sidebar stays fixed on the left — only <main> scrolls. Using min-h-screen here
  // lets the row grow with content, which stretches the sidebar and makes the
  // layout "shift"; h-screen + overflow-hidden isolates scrolling to the content.
  return (
    <div className="flex h-screen overflow-hidden">
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
