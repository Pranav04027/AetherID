import dbConnect from "@/dbConfig/dbConfig";
import { User } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import mailer from "@/helpers/mailer";

dbConnect();

export enum mailtype {
  VERIFY = "VERIFY",
  RESET = "RESET"
}

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
    const exisitingUser = await User.findOne({ username: username }).select("-password");
    if (exisitingUser) {
      return NextResponse.json(
        { success: false, message: "User already exisit" },
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

    await mailer(email, rawToken, mailtype.VERIFY);

    if (process.env.ENVIROMENT === "development") {
      console.log("Created user:", user);
    }

    return NextResponse.json(
      { message: "Account created! Please check your email.", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error occured in creating user in DB:", error);
    return NextResponse.json(
      // In the frontend: error.response.data.messaage, error.response.status
      { message: "Server Error", success: false }, // data
      { status: 500 } // direct status
    );
  }
}
