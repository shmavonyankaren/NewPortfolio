"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(form: FormData) {
  const username = form.get("username");
  const password = form.get("password");
  const adminName = process.env.ADMIN_NAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminName && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("isAdmin", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return { success: true };
  } else {
    return { success: false };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("isAdmin");
  redirect("/login");
}
