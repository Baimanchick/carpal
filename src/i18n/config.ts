export const LOCALES = ["ru", "en", "kg"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  kg: "Кыргызча",
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  kg: "KG",
};
