import dbConnect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import {User} from "@/models/User"
import {AuthCode} from "@/models/AuthCode"
import {Client} from "@/models/Client"

export async function POST(request: NextRequest){
    try {
        await dbConnect();

        const body = await request.json()
        const {redirect_uri, responseType, client_id, user_Email, user_password} = body;

        if(!redirect_uri || !responseType || !client_id || !user_Email || !user_password){
            return NextResponse.json(
                {message: "One or more fields are absent in request", success: false},
                {status: 400}
            )
        }

        const user = await User.findOne({email: user_Email})
        if(!user){
            return NextResponse.json(
                {message: "User Not found", success: false},
                {status: 400}
            )
        }

        if(!user.isVerified){
            return NextResponse.json(
                {message: "Please first Verify your Email", success: false},
                {status: 400}
            )
        }

        const isPasswordCorrect = await user.comparePassword(user_password)
        if(!isPasswordCorrect){
             return NextResponse.json(
                {message:"Incorrect Password", success: false},
                {status: 400}
            )
        }

        const code =  crypto.randomBytes(16).toString("hex")
        const codeHash = crypto.createHash("sha256").update(code).digest("hex")

        //Verify the Redirect URI from the client provided redireect URIs

        const client = await Client.findOne({clientId: client_id})

        var validURI = false
        client.allowedRedirectUris.forEach((element: string)=>{
            if(element == redirect_uri){
                validURI = true
            }
        })

        if(!validURI){
            return NextResponse.json(
                {message:"The provided redirect URI is Does NOT match with any of the provided URIs by the app client", success: false},
                {status: 400}
            )
        }

        const authDoc = await AuthCode.create({
            codeHash: codeHash,
            userId: user?.userId,
            redirectUri: redirect_uri,
            responseType: responseType,
            expiresAt: new Date(Date.now() + 7 * 60 * 1000),
            used: false
        })

        if(process.env.ENVIROMENT==="development"){
            console.log("Created Successfully: ", authDoc)
        }

        return NextResponse.json(
            {code: code, message: "Created succcessfully", success: true},
            {status: 201}
        )

    } catch (error: any) {
        console.error("Error occured:", error)
        return NextResponse.json(
            {message: "Some error Occured", success: false},
            {status: 400}
        )
    }
}