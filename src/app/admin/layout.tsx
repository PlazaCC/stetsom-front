import QueryProvider from '@/components/query-provider'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground">
          <nav className="p-4">
            {/* Admin navigation */}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </QueryProvider>
  );
}
