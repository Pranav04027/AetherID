import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models/User";
import dbConnect from "@/dbConfig/dbConfig";
import crypto from "crypto";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawToken } = body;
    if (!rawToken) {
      return NextResponse.json(
        { message: "Raw Token was not recived", success: false },
        { status: 400 }
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({ verifyToken: hashedToken }).select("-password");
    if (!user) {
      return NextResponse.json(
        { message: "User was not found", success: false },
        { status: 400 }
      );
    }

    if(user.verifyTokenExpiry < Date.now()){
        return NextResponse.json(
            {message: "Tokens Expired", success: false},
            {status: 400}
        )
    }

    if(hashedToken === user.verifyToken){
        user.isVerified = true;
        user.verifyToken = undefined;      // Clear the token
        user.verifyTokenExpiry = undefined;

        await user.save()
        
        return NextResponse.json(
            {message:"Success! Verified", success: true},
            {status: 200}
        )
    }else{
        return NextResponse.json(
            {message:"User DOES NOT match", success: false},
            {status: 400}
        )
    }
    
  } catch (error: any) {
    return NextResponse.json(
        {messgae:"Error occured", success: false},
        {status: 400}
    )
  }
}
