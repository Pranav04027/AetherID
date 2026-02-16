import Nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export enum mailtype {
  VERIFY = "VERIFY",
  RESET = "RESET",
}

export default async function mailer(
  userEmail: string,
  Token: any,
  type: string
) {
  try {
    

    const sender = {
      address: "no-reply@aetherid.com",
      name: "AetherID Support",
    };

    const domain = process.env.DOMAIN || "http://localhost:3000";
    const subject =
      type === "VERIFY"
        ? "Verify your email | AetherID"
        : "Reset your password | AetherID";

    // Construct the correct link
    const link =
      type === "VERIFY"
        ? `${domain}/verify?verifytoken=${Token}`
        : `${domain}/resetpassword?resettoken=${Token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <h2 style="color: #065F46; text-align: center;">AetherID</h2>
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #111827;">${
            type === "VERIFY" ? "Verify your email" : "Reset Password"
          }</h3>
          <p style="color: #4b5563;">
            ${
              type === "VERIFY"
                ? "Welcome to AetherID! Please click the button below to verify your email address and activate your account."
                : "We received a request to reset your password. Click the button below to proceed."
            }
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${link}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              ${type === "VERIFY" ? "Verify Email" : "Reset Password"}
            </a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
          <p style="color: #059669; font-size: 12px; word-break: break-all;">${link}</p>
        </div>
      </div>
    `;

    

  } catch (error: any) {
    console.error("Error occured while sending mail", error.message);
    throw new Error(error.message);
  }
}
