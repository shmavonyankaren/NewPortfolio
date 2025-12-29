import { Resend } from "resend";

async function sendEmail(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    📧 New Contact Message
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                    Portfolio Contact Form
                  </p>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.5;">
                    You have received a new message from your Portfolio contact form:
                  </p>

                  <!-- Subject -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                    <tr>
                      <td>
                        <p style="margin: 0 0 5px 0; color: #4b5563; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                          Subject
                        </p>
                        <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">
                          ${subject}
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Sender Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                    <tr>
                      <td width="50%" style="padding-right: 10px;">
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                          <p style="margin: 0 0 5px 0; color: #4b5563; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Name
                          </p>
                          <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                            ${name}
                          </p>
                        </div>
                      </td>
                      <td width="50%" style="padding-left: 10px;">
                        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                          <p style="margin: 0 0 5px 0; color: #4b5563; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            Email
                          </p>
                          <p style="margin: 0; color: #111827; font-size: 16px; font-weight: 500;">
                            <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">
                              ${email}
                            </a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Message -->
                  <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 20px;">
                    <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Message
                    </p>
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                      ${message}
                    </p>
                  </div>

                  <!-- Reply Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                    <tr>
                      <td align="center">
                        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
      subject
    )}" 
                           style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);">
                          Reply to ${name.split(" ")[0]}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    This email was sent from your Portfolio contact form
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} Portfolio. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "2003.karen.shmavonyan@gmail.com",
      subject: subject,
      html: htmlTemplate,
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export default sendEmail;
