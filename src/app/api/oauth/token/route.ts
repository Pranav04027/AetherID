import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/dbConfig/dbConfig";
import { AuthCode } from "@/models/AuthCode";
import { Client } from "@/models/Client";
import { User } from "@/models/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { code, clientId, clientSecret, redirectUri } = body;

    if (!code || !clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: "One or more of the parameters are missing" },
        { status: 400 }
      );
    }

    const clientApp = await Client.findOne({ clientId });
    if (!clientApp) {
      return NextResponse.json({ error: "Invalid Client Id" }, { status: 401 });
    }
    if (clientApp.clientSecret !== clientSecret) {
      return NextResponse.json(
        { error: "Invalid Client Secret" },
        { status: 401 }
      );
    }

    const incomingCodeHash = crypto
      .createHash("sha256")
      .update(code)
      .digest("hex");

    const authDoc = await AuthCode.findOne({ codeHash: incomingCodeHash });

    if (!authDoc) {
      return NextResponse.json({ error: "Invalid Auth Code" }, { status: 400 });
    }

    if (new Date() > authDoc.expiresAt) {
      return NextResponse.json({ error: "Code has expired" }, { status: 400 });
    }

    if (authDoc.used) {
      return NextResponse.json({ error: "Code already used" }, { status: 400 });
    }

    if (authDoc.redirectUri !== redirectUri) {
      return NextResponse.json(
        { error: "Redirect URI mismatch" },
        { status: 400 }
      );
    }

    authDoc.used = true;
    await authDoc.save();

    // Find the user with code
    const user = await User.findOne({ userId: authDoc.userId }); //UUID

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const accessToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        clientId: clientId, // Bind token to this specific app
      },
      process.env.TOKEN_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    user.refreshToken.push({
      tokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdFrom: "api_exchange",
    });

    await user.save();

    return NextResponse.json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 15*60, // 15 mins in seconds
      refresh_token: refreshToken,
      id_token: "",
    });
  } catch (error: any) {
    console.error("Exchange Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
