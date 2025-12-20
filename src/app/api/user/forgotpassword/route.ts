import dbConnect from "@/dbConfig/dbConfig";
import mailer from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import crypto from "crypto";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: "invalid_request", success: false },
                { status: 400 }
            );
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: "user_not_found", success: false },
                { status: 404 }
            );
        }

        // Create a password reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetToken = resetTokenHash;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send password reset email
        await mailer(user.email, resetToken, "RESET");

        return NextResponse.json(
            { message: "reset_email_sent", success: true },
            { status: 200 }
        );
    }catch (error) {
        console.error("Error in forgot password:", error);
        return NextResponse.json(
            { message: "server_error" , success: false},
            { status: 500 });
    }
}