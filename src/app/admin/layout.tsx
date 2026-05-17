import QueryProvider from '@/components/query-provider'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <QueryProvider>
      <div className='flex min-h-screen'>
        <aside className='w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground'>
          <nav className='p-4' />
        </aside>
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </QueryProvider>
  )
}
