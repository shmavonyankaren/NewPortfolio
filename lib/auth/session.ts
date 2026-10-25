import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "adminSession";
export const SESSION_SECONDS = 86400;
function secret() {
  // A dedicated secret is preferred. Credential rotation also invalidates sessions.
  const value = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("Configure ADMIN_SESSION_SECRET and admin credentials.");
  return value;
}
export function credentialsMatch(value: unknown, expected: string | undefined) {
  if (typeof value !== "string" || !expected) return false;
  const a = Buffer.from(value), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function createSession(now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(now / 1000) + SESSION_SECONDS, nonce: randomBytes(24).toString("hex") })).toString("base64url");
  return payload + "." + createHmac("sha256", secret()).update(payload).digest("base64url");
}
export function verifySession(token?: string, now = Date.now()) {
  try {
    if (!token || token.length > 1024) return false;
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return false;
    const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
    if (!credentialsMatch(signature, expected)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > now / 1000 && typeof data.nonce === "string";
  } catch { return false; }
}
