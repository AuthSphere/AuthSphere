/** Generate a random code verifier for PKCE */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/** Generate code challenge from verifier using SHA-256 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(hash));
}

/** Generate random state for CSRF protection */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/** Base64 URL encode without padding */
function base64UrlEncode(buffer: Uint8Array): string {
  // Convert Uint8Array to binary string in chunks to avoid stack overflow
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary) // standard Base64
    .replace(/\+/g, "-") // convert to Base64 URL
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
