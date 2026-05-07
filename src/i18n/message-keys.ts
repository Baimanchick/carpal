const KEY_PREFIX = "msg_";

export function encodeMessageKey(key: string) {
  const bytes = new TextEncoder().encode(key);
  const encoded = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `${KEY_PREFIX}${encoded}`;
}

export function decodeMessageKey(key: string) {
  if (!key.startsWith(KEY_PREFIX)) {
    return key;
  }

  const encoded = key.slice(KEY_PREFIX.length);

  if (encoded.length === 0 || encoded.length % 2 !== 0) {
    return key;
  }

  try {
    const bytes = new Uint8Array(
      encoded.match(/.{2}/g)?.map((chunk) => Number.parseInt(chunk, 16)) ?? [],
    );

    return new TextDecoder().decode(bytes);
  } catch {
    return key;
  }
}

export function encodeMessages(messages: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [encodeMessageKey(key), value]),
  );
}
