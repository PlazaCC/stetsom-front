import "@/app/globals.css";
import { Barlow, Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";

const barlow = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Geist Sans — CMS/admin typeface (Mantine-inspired). Public site stays Barlow.
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
      className={`${barlow.variable} ${barlowCondensed.variable} ${geist.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
