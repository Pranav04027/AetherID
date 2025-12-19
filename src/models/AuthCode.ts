import mongoose, { Schema } from "mongoose";

const authCodeSchema = new Schema({
    codeHash: {
        type: String,
        required: true,
        unique: true,       // each auth code should be one-time use
    },

    userId: {
        type: String,       // store UUID, not _id
        required: true,
    },

    redirectUri: {
        type: String,
        required: true,     // ensures the code can only be used by the requesting app
    },
    responseType:{
        type: String,
        required:true
    },

    expiresAt: {
        type: Date,
        required: true,
        expires: 0          // enables MongoDB TTL auto-delete
    },

    used: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export const AuthCode =
    mongoose.models.authcodes || mongoose.model("authcodes", authCodeSchema);
