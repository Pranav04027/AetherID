import mongoose from "mongoose";
import dbConnect from "@/dbConfig/dbConfig";
import {User} from "@/models/User"
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

dbConnect();

export async function POST(request: NextRequest){
    try {
        const body = await request.json()
        const {username, email, password} = body
        if(!username || !email || !password){
            return NextResponse.json(
                {message: "One of the 3 necessary fields is missing", success: false},
                {status: 400}
            )
        }
    
        //Check if user already exists.
        const exisitingUser = await User.findOne({username: username}).select("-password")
        if(exisitingUser){
            return NextResponse.json(
                {success: false, message: "User already exisit"},
                {status: 400}
            )
        }
        
        const newUserId = uuidv4();

        const user = await User.create({
            userId: newUserId,
            username: username,
            email: email,
            password: password
        })
        if(process.env.ENVIROMENT === "development"){
            console.log("Created user:",user)
        }

        const checkUser = await User.findOne({$or: [{email}, {password}]}).select("password");

        if(checkUser){
            return NextResponse.json(
                {message: "User created successfully", success: true},
                {status: 200}
            )
        }else{
            return NextResponse.json(
                {message:"User was not created", success: true},
                {status: 400}
            )
        }


    } catch (error: any) {
       console.error("Error occured in creating user in DB:", error);
       return NextResponse.json(        // In the frontend: error.response.data.messaage, error.response.status
        {message: "Server Error", success: false},  // data
        {status: 500} // direct status
    )
    }
        
}
