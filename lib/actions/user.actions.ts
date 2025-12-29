"use server";

import sendEmail from "@/lib/utils/sendEmail";

export async function sendContactForm(form: FormData) {
  try {
    const name = form.get("name");
    const email = form.get("email");
    const subject = form.get("subject");
    const message = form.get("message");

    if (!name || !email || !message) {
      throw new Error("Missing required fields");
    }

    const result = await sendEmail(
      name as string,
      email as string,
      (subject as string) || "Contact Form Message",
      message as string
    );

    if (!result.success) {
      throw new Error(result.error || "Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    throw error instanceof Error ? error : new Error("Failed to send message");
  }
}
