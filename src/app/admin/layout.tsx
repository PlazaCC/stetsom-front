import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/components/query-provider";
import "./admin.css";
import { AdminShell } from "./_components/admin-shell";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <div className="cms">
        <AdminShell>{children}</AdminShell>
        <Toaster />
      </div>
    </QueryProvider>
  );
}
