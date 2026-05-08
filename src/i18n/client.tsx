"use client";

import {
  NextIntlClientProvider as BaseNextIntlClientProvider,
  useLocale,
  useTranslations as useBaseTranslations,
} from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { getI18nMessageFallback, onI18nError } from "./error-handling";
import { encodeMessageKey } from "./message-keys";

type TranslationValues = Record<string, unknown>;

type Translator = {
  (key: string, values?: TranslationValues, formats?: unknown): string;
  rich: (key: string, values?: TranslationValues, formats?: unknown) => ReactNode;
  markup: (key: string, values?: TranslationValues, formats?: unknown) => string;
  raw: (key: string) => unknown;
  has: (key: string) => boolean;
};

function wrapTranslator(translator: Translator) {
  const wrapped = ((key: string, values?: TranslationValues, formats?: unknown) =>
    translator(encodeMessageKey(key), values, formats)) as Translator;

  wrapped.rich = ((key: string, values?: TranslationValues, formats?: unknown) =>
    translator.rich(encodeMessageKey(key), values, formats)) as Translator["rich"];

  wrapped.markup = ((key: string, values?: TranslationValues, formats?: unknown) =>
    translator.markup(encodeMessageKey(key), values, formats)) as Translator["markup"];

  wrapped.raw = ((key: string) =>
    translator.raw(encodeMessageKey(key))) as Translator["raw"];

  wrapped.has = ((key: string) =>
    translator.has(encodeMessageKey(key))) as Translator["has"];

  return wrapped;
}

type NextIntlClientProviderProps = ComponentProps<
  typeof BaseNextIntlClientProvider
>;

export function NextIntlClientProvider({
  children,
  ...props
}: NextIntlClientProviderProps) {
  return (
    <BaseNextIntlClientProvider
      {...props}
      onError={onI18nError}
      getMessageFallback={getI18nMessageFallback}
    >
      {children}
    </BaseNextIntlClientProvider>
  );
}

export function useTranslations() {
  return wrapTranslator(useBaseTranslations() as unknown as Translator);
}

export { useLocale };
