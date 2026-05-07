import {
  getLocale,
  getMessages,
  getRequestConfig,
  getTranslations as getBaseTranslations,
} from "next-intl/server";
import type { ReactNode } from "react";
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

export async function getTranslations() {
  return wrapTranslator((await getBaseTranslations()) as unknown as Translator);
}

export { getLocale, getMessages, getRequestConfig };
