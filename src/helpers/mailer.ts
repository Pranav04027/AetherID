import Nodemailer from "nodemailer";
import crypto from "crypto";
import { MailtrapTransport } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

export enum mailtype {
  VERIFY = "VERIFY",
  RESET = "RESET"
}

export default async function mailer(userEmail: string, Token: any, type: string) {
  try {
    const transport = Nodemailer.createTransport(
      MailtrapTransport({
        token: process.env.MAILTOKEN!,
      })
    );

    const sender = {
      address: "hello@demomailtrap.co",
      name: "AetherID Support",
    };
    const recipients = [userEmail];

    const domain = process.env.DOMAIN || "http://localhost:3000"
    const subject = type === "VERIFY" ? "Email verification for AetherID" : "Password reset for AetherID"
    const link = type === "VERIFY" ? `${domain}/verify?verifytoken=${Token}` : `${domain}/resetpassword?resettoken=${Token}`

    // Log the link in console for development/testing ease
    console.log("=======================================================");
    console.log(`[MAILER] Sending ${type} email to ${userEmail}`);
    console.log(`[MAILER] Link: ${link}`);
    console.log("=======================================================");

    await transport.sendMail({
      from: sender,
      to: recipients,
      subject: subject,
      text: type === "VERIFY" ? `To verify Email for AetherID please click on this link: ${link}` : `To change password for AetherID please click on this link: ${link}`,
      category: "Integration Test",
    });
    console.log("Email sent successfully");

  } catch (error: any) {
    console.error("Error occured while sending mail", error.message);
    // We don't throw here so the signup process doesn't fail completely in dev
  }
}
