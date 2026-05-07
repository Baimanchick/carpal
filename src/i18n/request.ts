import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale } from "./config";
import { decodeMessageKey, encodeMessages } from "./message-keys";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;
  const locale: Locale =
    cookieLocale && LOCALES.includes(cookieLocale)
      ? cookieLocale
      : DEFAULT_LOCALE;

  const messages = encodeMessages(
    (await import(`../../messages/${locale}.json`)).default,
  );

  return {
    locale,
    messages,
    onError(error: { code: string }) {
      // Missing translations fall back to the original source text,
      // so don't spam the console for every missing entry in en/kg.
      if (error.code === "MISSING_MESSAGE") return;
      console.error(error);
    },
    getMessageFallback({ key }: { key: string }) {
      return decodeMessageKey(key);
    },
  };
});
