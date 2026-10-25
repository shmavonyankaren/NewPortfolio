import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./session";

export async function isAdmin() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}
export async function authorizeMutation(request: Request) {
  if (!await isAdmin()) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden origin" }, { status: 403 });
  return null;
}
