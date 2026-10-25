"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, credentialsMatch, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/auth/session";

export async function loginAdmin(form: FormData) {
  const username = form.get("username");
  const password = form.get("password");
  const adminName = process.env.ADMIN_NAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (credentialsMatch(username, adminName) && credentialsMatch(password, adminPassword)) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, createSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_SECONDS,
      path: "/",
    });
    return { success: true };
  } else {
    return { success: false };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("isAdmin");
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
