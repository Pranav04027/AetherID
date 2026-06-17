import { Resend } from 'resend';
import * as dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API);

export enum mailtype {
  VERIFY = "VERIFY",
  RESET = "RESET",
}

export default async function mailer(
  userEmail: string,
  token: string,
  type: mailtype
) {
  const domain = process.env.DOMAIN || "http://localhost:3000";
  const fromEmail = process.env.FROM_EMAIL || "AetherID <onboarding@resend.dev>";

  const link =
    type === mailtype.VERIFY
      ? `${domain}/verify?verifytoken=${token}`
      : `${domain}/resetpassword?resettoken=${token}`;

  const subject =
    type === mailtype.VERIFY
      ? "Verify your email | AetherID"
      : "Reset your password | AetherID";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
      <h2 style="color: #065F46; text-align: center;">AetherID</h2>
      <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #111827;">${type === mailtype.VERIFY ? "Verify your email" : "Reset Password"}</h3>
        <p style="color: #4b5563;">
          ${
            type === mailtype.VERIFY
              ? "Welcome to AetherID! Please click the button below to verify your email address and activate your account."
              : "We received a request to reset your password. Click the button below to proceed."
          }
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            ${type === mailtype.VERIFY ? "Verify Email" : "Reset Password"}
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
        <p style="color: #059669; font-size: 12px; word-break: break-all;">${link}</p>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: userEmail,
    subject,
    html,
  });

  if (error) {
    console.error("Error occurred while sending mail:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
