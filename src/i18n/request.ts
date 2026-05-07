import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value as
    | Locale
    | undefined;
  const locale: Locale =
    cookieLocale && LOCALES.includes(cookieLocale)
      ? cookieLocale
      : DEFAULT_LOCALE;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    onError(error) {
      // Missing translations fall back to the key (which is Russian source text),
      // so don't spam the console for every missing entry in en/kg.
      if (error.code === "MISSING_MESSAGE") return;
      console.error(error);
    },
    getMessageFallback({ key }) {
      return key;
    },
  };
});
