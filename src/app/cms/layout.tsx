import QueryProvider from '@/components/query-provider';

export default function CMSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <QueryProvider>{children}</QueryProvider>;
}
