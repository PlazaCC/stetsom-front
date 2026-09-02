import "@/app/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";

// Satoshi — site typeface (headings + paragraphs).
const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist Sans — CMS/admin typeface (Mantine-inspired). Public site uses Satoshi.
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

async function safeGetLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch {
    return "pt-BR";
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await safeGetLocale();

  return (
    <html
      lang={locale}
      className={`${satoshi.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
