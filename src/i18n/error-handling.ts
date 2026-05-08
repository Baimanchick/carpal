import { IntlErrorCode } from "next-intl";
import { decodeMessageKey } from "./message-keys";

type I18nError = {
  code: string;
};

type MessageFallbackParams = {
  key: string;
  namespace?: string | null;
};

export function onI18nError(error: I18nError) {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return;
  }

  console.error(error);
}

export function getI18nMessageFallback({
  key,
  namespace,
}: MessageFallbackParams) {
  const decodedKey = decodeMessageKey(key);

  return namespace ? `${namespace}.${decodedKey}` : decodedKey;
}
