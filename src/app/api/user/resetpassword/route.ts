import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/dbConfig/dbConfig";
import crypto from "crypto";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const reqBody = await request.json();
        const { token, newPassword, } = reqBody;

        if (!token || !newPassword) {
            return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // 3. Find User by Token AND Check Expiry
        // $gt means "Greater Than" -> Expiry must be in the future
        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // 4. Update Password (pre-save hook will hash it)
        user.password = newPassword;

        // 5. Clean up: Remove the used token so it can't be used again
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Password reset successfully",
            success: true
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}