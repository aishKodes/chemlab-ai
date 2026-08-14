export function createBrowserId(prefix = "id") {
  const nativeUuid = globalThis.crypto?.randomUUID?.();
  if (nativeUuid) return `${prefix}_${nativeUuid}`;

  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${prefix}_${value}`;
  }

  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}
