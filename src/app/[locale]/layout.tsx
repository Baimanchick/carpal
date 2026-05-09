import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/app/providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/i18n/config";
import { NextIntlClientProvider } from "@/i18n/client";
import { getMessages, getTranslations } from "@/i18n/server";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://carpal.kg";

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  en: "en_US",
  kg: "ky_KG",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type MetadataParams = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataParams): Promise<Metadata> {
  const requestedLocale = (await params).locale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("CarPal — P2P аренда машин для путешествий по Кыргызстану"),
      template: "%s · CarPal",
    },
    description: t(
      "Арендуйте проверенные горные авто у локальных хостов в Кыргызстане. Эскроу-платежи, GPS, страховка и встроенный гид по безопасности на дороге.",
    ),
    openGraph: {
      type: "website",
      siteName: "CarPal",
      locale: OPEN_GRAPH_LOCALE[locale],
      title: t("CarPal — каршеринг по Кыргызстану. По-взрослому."),
      description: t(
        "Открытое бета-тестирование 20 мая 2026. GPS на каждой машине, эскроу-депозит, фото-протокол. Первые 100 туристов получают сутки аренды бесплатно.",
      ),
      images: [
        {
          url: "/icon.jpg",
          width: 1200,
          height: 630,
          alt: "CarPal",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("CarPal — каршеринг по Кыргызстану"),
      description: t(
        "Открытое бета-тестирование 20 мая 2026. GPS, эскроу, фото-протокол.",
      ),
      images: ["/icon.jpg"],
    },
  };
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

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
