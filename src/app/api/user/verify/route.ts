import mailer from "@/helpers/mailer";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/dbConfig/dbConfig";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "No email", success: false },
        { status: 400 }
      );
    }

    // Token stuff
    // 1) Create tokens
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "User not found with the email", success: false },
        { status: 400 }
      );
    }

    if(user){
        user.verifyToken = hashedToken;
        user.verifyTokenExpiry = Date.now() + 3600000

        await user.save()
    }

    await mailer(email, rawToken, "verify")
    

  } catch (error: any) {
    console.error("Some error", error);
    return NextResponse.json(
      { message: "Some error", success: false },
      { status: 500 }
    );
  }
}
