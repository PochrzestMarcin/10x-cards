// Cross-runtime hashing helper using Web Crypto when available, with Node fallback

/**
 * Computes a hex-encoded hash for a given input string.
 * Prefers Web Crypto (Workers/Browser). Falls back to Node's crypto in local dev.
 */
export async function computeHashHex(input: string, algorithm: "SHA-256" = "SHA-256"): Promise<string> {
  const encodeToBytes = (text: string): Uint8Array => new TextEncoder().encode(text);

  // Web Crypto path (Cloudflare Workers, modern browsers, Node 20+ global)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalCrypto: any = (globalThis as unknown as { crypto?: unknown }).crypto;
  if (globalCrypto && typeof globalCrypto === "object" && "subtle" in globalCrypto) {
    const bytes = encodeToBytes(input);
    const digest = await (globalCrypto as Crypto).subtle.digest(algorithm, bytes.buffer as ArrayBuffer);
    return bufferToHex(digest);
  }

  // Node fallback for local dev (not used in Cloudflare runtime)
  try {
    const nodeCrypto = await import("node:crypto");
    return nodeCrypto.createHash("sha256").update(input).digest("hex");
  } catch {
    // Last resort (should not happen): simple non-cryptographic hash
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const chr = input.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return (hash >>> 0).toString(16);
  }
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}
