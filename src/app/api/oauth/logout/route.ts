import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function POST(request: NextRequest) {

    const response = NextResponse.json(
        { message: "Logged out successfully" }, 
        { status: 200 }
    );
    // clear cookies
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    try {
        await dbConnect();

        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return response; 
        }

        const accessToken = authHeader.split(" ")[1];
        let decoded: any;

        try {
            decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET!);
        } catch (error) {
            return response;
        }

        const body = await request.json();
        const { token, all } = body; 

        const user = await User.findOne({ userId: decoded.userId });
        
        if (user) {
            if (all === true) {
                user.refreshToken = [];
                await user.save();
            } else if (token) {
                const incomingTokenHash = crypto.createHash("sha256").update(token).digest("hex");
                user.refreshToken = user.refreshToken.filter(
                    (element: any) => element.tokenHash !== incomingTokenHash
                );
                await user.save();
            }
        }

        return response;

    } catch (error: any) {
        return response;
    }
}