import { User } from "@/models/User";
import dbConnect from "@/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const header = request.headers.get("authorization");
        if (!header?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "invalid_request", error_description: "Missing Bearer Token" },
                { status: 400 }
            );
        }

        const accessToken = header.split(" ")[1];

        const decodedTokens = jwt.verify(accessToken, process.env.TOKEN_SECRET!) as any;

        const userID = decodedTokens.userId;
        const user = await User.findOne({ userId: userID }).select("-password");

        if (!user) {
            return NextResponse.json(
                { error: "invalid_token", error_description: "User no longer exists" },
                { status: 401 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { error: "insufficient_scope", error_description: "User is not verified" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            sub: user.userId,
            email: user.email,
            name: user.username,
            preferred_username: user.username,
            email_verified: user.isVerified
        });

    } catch (error: any) {
        
        if (error.name === "TokenExpiredError") {
            return NextResponse.json(
                { 
                    error: "invalid_token", 
                    error_description: "The access token expired" 
                },
                { status: 401 }
            );
        }
        
        return NextResponse.json(
            { 
                error: "invalid_token", 
                error_description: "Token invalid or malformed" 
            },
            { status: 401 }
        );
    }
}