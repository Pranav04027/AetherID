import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { refresh } from "next/cache";

const userSchema = new mongoose.Schema({
    userId: {       // UUID for the user
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },


    //Token Fields
    verifyToken: { //These are hashed Token
        type: String,
        default: null
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    },
    resetToken:{
        type: String,
        default: null
    },
    resetTokenExpiry:{
        type: Date,
        default: null
    },

    refreshToken:[{
        tokenHash:{
            type: String,
            required: true
        },
        expiresAt:{
            type: Date,
            required: true,
        },
        createdFrom:{ //Optional for IP tracking
            type: String,
            default:"web"
        }
    }],
}, { timestamps: true});

// Method to set password
userSchema.pre('save', async function (this: any) {
    const user = this as any;

    if (user.isModified('password')) {
     user.password = await bcrypt.hash(user.password, 12);
    }

});

userSchema.methods.comparePassword = async function(password: string){
    const user = this as any;
    return bcrypt.compare(password, user.password);
}

export const User = mongoose.models.users || mongoose.model('users', userSchema);