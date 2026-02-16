const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env" }); // Load env variables from root .env

async function main() {
    console.log("Testing Gmail Configuration...");
    console.log("User:", process.env.GMAIL_USER);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error("ERROR: GMAIL_USER or GMAIL_PASS is missing in .env file");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Test Script" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Send to self
        subject: "AetherID Test Email",
        text: "If you receive this, your Gmail App Password configuration is working correctly!",
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Success! Email sent: " + info.response);
    } catch (error) {
        console.error("❌ Failed to send email:");
        console.error(error);
    }
}

main();
