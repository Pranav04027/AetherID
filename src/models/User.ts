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
    passwordHash: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    avatar:{
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },


    //Token Fields
    verifyToken: {
        type: String,
        default: null
    },
    veryfyTokenExpiry: {
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

    if (user.isModified('passwordHash')) {
     user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
    }

});

userSchema.methods.comparePassword = async function(password: string){
    const user = this as any;
    return bcrypt.compare(password, user.passwordHash);
}

export const User = mongoose.models.users || mongoose.model('users', userSchema);