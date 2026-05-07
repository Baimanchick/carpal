import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/app/providers";
import { NextIntlClientProvider } from "@/i18n/client";
import { getLocale, getMessages } from "@/i18n/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CarPal — P2P аренда машин для путешествий по Кыргызстану",
    template: "%s · CarPal",
  },
  description:
    "Арендуйте проверенные горные авто у локальных хостов в Кыргызстане. Эскроу-платежи, GPS, страховка и встроенный гид по безопасности на дороге.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
