import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { getI18nMessageFallback, onI18nError } from "./error-handling";
import { routing } from "./routing";
import { encodeMessages } from "./message-keys";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = encodeMessages(
    (await import(`../../messages/${locale}.json`)).default,
  );

  return {
    locale,
    messages,
    timeZone: "Asia/Bishkek",
    onError: onI18nError,
    getMessageFallback: getI18nMessageFallback,
  };
});
