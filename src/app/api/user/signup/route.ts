import dbConnect from "@/dbConfig/dbConfig";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import mailer from "@/helpers/mailer";
import { mailtype } from "@/helpers/mailer";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "One of the 3 necessary fields is missing", success: false },
        { status: 400 }
      );
    }

    //Check if user already exists.
    const exisitingUser = await User.findOne({ $or: [{ username: username }, { email: email }] }).select("-password");
    if (exisitingUser) {
      return NextResponse.json(
        { success: false, message: "User with this username or email already exists" },
        { status: 400 }
      );
    }

    //Send Verification Email
    // 1) Create tokens
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");


    const newUserId = uuidv4();

    const user = await User.create({
      userId: newUserId,
      username: username,
      email: email,
      password: password,
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 3600000
    });

    try {
      await mailer(email, rawToken, mailtype.VERIFY);
    } catch (mailError) {
      // If email fails, delete the user so they can try again (Atomic-ish for this flow)
      await User.findByIdAndDelete(user._id);
      console.error("Email sending failed, rolling back user creation:", (mailError as Error).message);
      return NextResponse.json(
        { message: "Failed to send verification email. Please check your email configuration.", success: false },
        { status: 500 }
      );
    }

    if (process.env.ENVIROMENT === "development") {
      console.log("Created user:", user);
    }

    return NextResponse.json(
      { message: "Account created! Please check your email.", success: true },
      { status: 201 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Signup Error:", err.message);
    return NextResponse.json(
      { message: "Internal Server Error: " + err.message, success: false },
      { status: 500 }
    );
  }
}
