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

    const {
      grant_type,
      code,
      refresh_token,
      clientId,
      clientSecret,
      redirectUri,
    } = body;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401 });
    }

    const clientApp = await Client.findOne({ clientId });
    if (!clientApp || clientApp.clientSecret !== clientSecret) {
      return NextResponse.json({ error: "invalid_client" }, { status: 401 });
    }

    if (grant_type === "authorization_code") {
      if (!code || !redirectUri) {
        return NextResponse.json({ error: "invalid_request" }, { status: 400 });
      }

      const incomingCodeHash = crypto
        .createHash("sha256")
        .update(code)
        .digest("hex");
      const authDoc = await AuthCode.findOne({ codeHash: incomingCodeHash });

      if (!authDoc || authDoc.used || new Date() > authDoc.expiresAt) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
      }

      if (authDoc.redirectUri !== redirectUri) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
      }

      // Mark code as used
      authDoc.used = true;
      await authDoc.save();

      // Find User
      const user = await User.findOne({ userId: authDoc.userId });
      if (!user)
        return NextResponse.json({ error: "server_error" }, { status: 500 });

      // ISSUE TOKENS (Helper function below)
      return await issueTokens(user, clientId);
    } else if (grant_type === "refresh_token") {
      if (!refresh_token) {
        return NextResponse.json({ error: "invalid_request" }, { status: 400 });
      }

      // Verify the incoming refresh token
      let decoded: any;
      try {
        decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET!);
      } catch (e) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
      }

      const user = await User.findOne({ userId: decoded.userId });
      if (!user)
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });

      // Check if this token exists in DB and is active
      const incomingTokenHash = crypto
        .createHash("sha256")
        .update(refresh_token)
        .digest("hex");

      // Find the specific token in the array
      const tokenRecord = user.refreshToken.find(
        (entry: any) => entry.tokenHash === incomingTokenHash
      );

      if (!tokenRecord) {
        user.refreshToken = []; // remove all tokens
        await user.save();
        return NextResponse.json(
          { error: "invalid_grant" },
          { status: 400 }
        );
      }

      if (new Date() > new Date(tokenRecord.expiresAt)) {
        user.refreshToken = user.refreshToken.filter(
          (entry: any) => entry.tokenHash !== incomingTokenHash
        );
        await user.save();
        return NextResponse.json(
          { error: "invalid_grant"},
          { status: 400 }
        );
      }

      user.refreshToken = user.refreshToken.filter(
        (t: any) => t.tokenHash !== incomingTokenHash
      );

      return await issueTokens(user, clientId);
    } else {
      return NextResponse.json(
        { error: "unsupported_grant_type" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Exchange Error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
async function issueTokens(user: any, clientId: string) {
  // Tokens
  const accessToken = jwt.sign(
    { userId: user.userId, email: user.email, clientId: clientId },
    process.env.TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { userId: user.userId },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  user.refreshToken.push({ // .push cause it's an array
    tokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdFrom: "api_exchange",
  });

  await user.save();

  return NextResponse.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 900,
    refresh_token: refreshToken,
  });
}
