export const LOCALES = ["ru", "kg", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: "Русский",
  kg: "Кыргызча",
  en: "English",
};

export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  ru: "RU",
  kg: "KG",
  en: "EN",
};
