import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // 1. Get the cookie
        const token = request.cookies.get("token")?.value || "";

        if (!token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // 2. Verify the cookie
        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);

        // 3. Get User Data (Select only what you need for the UI)
        const user = await User.findOne({ userId: decoded.id }).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 4. Return Internal Dashboard Data
        return NextResponse.json({
            message: "User found",
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                isVerified: user.isVerified,
                isAdmin: user.isAdmin
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}