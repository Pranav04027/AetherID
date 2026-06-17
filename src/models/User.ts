import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

interface User extends Document {
    userId: string;
    email: string;
    password: string;
    username: string;
    isVerified: boolean;
    verifyToken: string | null;
    verifyTokenExpiry: Date | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    refreshToken: {
        tokenHash: string;
        expiresAt: Date;
        createdFrom: string;
        clientId?: string;
    }[];
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<User>(
    {
        userId: {
            // UUID for the user
            type: String,
            required: true,
            unique: true,
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
            default: false,
        },

        //Token Fields
        verifyToken: {
            //These are hashed Token
            type: String,
            default: null,
        },
        verifyTokenExpiry: {
            type: Date,
            default: null,
        },
        resetToken: {
            type: String,
            default: null,
        },
        resetTokenExpiry: {
            type: Date,
            default: null,
        },

        refreshToken: [
            {
                tokenHash: {
                    type: String,
                    required: true,
                },
                expiresAt: {
                    type: Date,
                    required: true,
                },
                createdFrom: {
                    //Optional for IP tracking
                    type: String,
                    default: "web",
                },
                clientId: {
                    type: String,
                },
            },
        ],
    },
    { timestamps: true },
);

// Method to set password
userSchema.pre("save", async function (this: User) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
});

userSchema.methods.comparePassword = async function (
    this: User,
    password: string,
) {
    return bcrypt.compare(password, this.password);
};

export const User =
    mongoose.models.users || mongoose.model<User>("users", userSchema);
