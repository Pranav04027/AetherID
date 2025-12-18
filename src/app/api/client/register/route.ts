import dbConnect from "@/dbConfig/dbConfig";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@/models/Client";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { appName, allowedRedirectUris, userEmail } = body;
    const cleanUris = allowedRedirectUris.filter((uri: string) => uri.trim() !== "");

    const clientId = crypto.randomBytes(16).toString("hex");
    const clientSecret = crypto.randomBytes(32).toString("hex");

    const user = await User.findOne({ email: userEmail }).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Could not find the user, Make sure you are registered and The provided Email is correct",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Provided user Email is not verified", success: false },
        { status: 400 }
      );
    }

    const client = await Client.create({
      clientId,
      clientSecret,
      appName,
      allowedRedirectUris: cleanUris,
      developerId: user.userId,
    });

    if (process.env.ENVIROMENT == "development") {
      console.log("Created User:", client);
    }

    return NextResponse.json(
      { message: "The Client was created Successfully", success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Some error occured", success: false },
      { status: 400 }
    );
  }
}
